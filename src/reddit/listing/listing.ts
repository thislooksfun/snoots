import type { Client } from "../../client";
import type { Query } from "../../gateway/types";
import type { AwaitableFunction, Maybe } from "../../helper/types";
import type { RedditObject } from "../types";

import { assertKind } from "../util";

/** @internal */
export interface ListingContext {
  client: Client;
  post?: string;
  request?: { url: string; query: Query };
}

/** @internal */
export interface RedditListing {
  after?: string;
  before?: string;
  children: RedditObject[];
  dist?: number;
  modhash?: string;
}

/** @internal */
export type ListingObject = RedditObject<RedditListing>;

/** @internal */
export interface RedditMore {
  count: number;
  name: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  parent_id: string;
  depth: number;
  children: string[];
}

/** @internal */
export interface Fetcher<T> {
  fetch(context: ListingContext): Promise<Listing<T>>;
}

/** @internal */
export abstract class Pager<T> implements Fetcher<T> {
  after: string;

  constructor(after: string) {
    this.after = after;
  }

  abstract fetch(context: ListingContext): Promise<Listing<T>>;

  protected async nextPage(context: ListingContext): Promise<RedditListing> {
    if (!context.request) throw "Unable to fetch next page";
    const query = { limit: "100", after: this.after, ...context.request.query };
    const nextListingObject: RedditObject = await context.client.gateway.get(
      context.request.url,
      query
    );
    assertKind("Listing", nextListingObject);
    return nextListingObject.data as RedditListing;
  }
}

/**
 * A Listing of items.
 *
 * Listings are probably the most common data type on Reddit. Snoots
 * intentionally exposes as little as possible about the internal workings to
 * minimize the amount of boilerplate needed to interact with them.
 *
 * @note Since Reddit's responses are paged, Listings only implement
 * asyncIterator. This means that if you want to loop over it you have to use
 * `for await`:
 * ```ts
 * const posts = await client.subreddits.getNewPosts("funny");
 * for await (const post of posts) {
 *   console.log(post.title);
 * }
 * ```
 *
 * @note If you want to iterate using callbacks, you can use {@link forEach}:
 * ```ts
 * const posts = await client.subreddits.getNewPosts("funny");
 * await posts.forEach(post => console.log(post.title));
 * ```
 *
 * @note If you want to get an entire page at a time, use {@link eachPage}:
 * ```ts
 * const posts = await client.subreddits.getNewPosts("funny");
 * await posts.eachPage(page => console.log(page.length));
 * ```
 *
 * @template T The type of items this Listing holds.
 */
export class Listing<T> {
  protected context: ListingContext;
  protected items: T[];
  protected fetcher?: Fetcher<T>;
  protected next?: Listing<T>;

  /** @internal */
  constructor(context: ListingContext, items: T[], fetcher?: Fetcher<T>) {
    this.context = context;
    this.items = items;
    this.fetcher = fetcher;
  }

  /**
   * Whether or not this listing is empty.
   *
   * @returns A promise that resolves to either `true` if the listing is empty
   * or `false` if it's not.
   */
  async empty(): Promise<boolean> {
    // If we have elements on hand, it's not empty.
    if (this.items.length > 0) return false;

    // If arr is empty with no way to get more, it's empty.
    if (!this.fetcher) return true;

    // This listing is empty but can fetch more. Do so, and if it was
    // successful, it's not empty.
    if (!this.next) {
      this.next = await this.fetcher.fetch(this.context);
    }
    return this.next.items.length > 0;
  }

  /**
   * Whether or not this listing can perform a fetch to get more data.
   *
   * If this returns `false` you can be sure that this listing will never cause
   * an api call. If this is `true` it does *not* mean that there are more
   * unfetched items in the Listing, only that there *might* be.
   *
   * @returns `true` if the listing could try to fetch more items, `false`
   * otherwise.
   */
  canFetchMore(): boolean {
    return !!this.fetcher;
  }

  /**
   * Execute a function on pages of the listing.
   *
   * @param handler The function to execute on each page. If this returns or
   * resolves to `false` the execution will be halted.
   *
   * @returns A promise that resolves when the listing has been exhausted.
   */
  async eachPage(
    handler: AwaitableFunction<T[], boolean | void>
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let page: Maybe<Listing<T>> = this;

    do {
      // If the function returns false at any point, we are done.
      const result = await handler(page.items);
      if (result === false) return;

      page = await Listing.nextPage(page, this.context);
    } while (page);
  }

  /**
   * Execute a function on each element of the listing.
   *
   * @note This is an enhanced version of the default Array.forEach. It allows
   * for asynchronous callbacks and breaking.
   *
   * @example Async
   * ```ts
   * async function slowAsync(post: Post): Promise<void> {
   *   // do something slow
   * }
   *
   * const posts = await client.subreddits.getNewPosts("funny");
   * await posts.forEach(post => slowAsync(post));
   * ```
   *
   * @example Breaking
   * ```ts
   * const posts = await client.subreddits.getNewPosts("funny");
   * await posts.forEach(post => {
   *   console.log(post.title);
   *   // Break if the post was more than 5 minutes old.
   *   return post.createdUtc >= (Date.now() / 1000) - 5 * 60;
   * });
   * ```
   *
   * @param handler The function to execute on each item in the listing. If this
   * returns or resolves to `false` the execution will be halted.
   *
   * @returns A promise that resolves when the iteration is complete.
   */
  async forEach(handler: AwaitableFunction<T, boolean | void>): Promise<void> {
    for await (const item of this) {
      const result = await handler(item);
      if (result === false) break;
    }
  }

  /**
   * Determines whether the specified callback function returns true for any
   * element of the listing.
   *
   * @param handler The matcher to run on each element in the listing. If this
   * returns `true` at any point the searching is stopped.
   *
   * @returns A promise that resolves to `true` if `handler` returned `true` for
   * some element in the listing, or `false` if it reached the end of the
   * listing without finding a match.
   */
  async some(handler: AwaitableFunction<T, boolean>): Promise<boolean> {
    for await (const item of this) {
      if (await handler(item)) return true;
    }
    return false;
  }

  /**
   * Get the first item of this listing.
   *
   * @returns A promise that resolves to either the first item of the listing,
   * or `undefined` if the listing is empty.
   */
  async first(): Promise<Maybe<T>> {
    for await (const item of this) {
      return item;
    }
    return undefined;
  }

  private static async nextPage<T>(
    page: Listing<T>,
    context: ListingContext
  ): Promise<Maybe<Listing<T>>> {
    if (page.next) {
      return page.next;
    } else if (page.fetcher) {
      const next = await page.fetcher.fetch(context);
      return next.items.length > 0 ? next : undefined;
    }
    return undefined;
  }

  /** @internal */
  [Symbol.asyncIterator]() {
    return {
      page: this as Listing<T>,
      context: this.context,
      index: 0,

      async next(): Promise<IteratorResult<T>> {
        if (this.index >= this.page.items.length) {
          const nextPage = await Listing.nextPage(this.page, this.context);
          if (!nextPage) return { done: true, value: undefined };
          this.page = nextPage;
          this.index = 0;
        }

        return { done: false, value: this.page.items[this.index++] };
      },
    };
  }
}
