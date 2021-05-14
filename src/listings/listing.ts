import type { AwaitableFn, RedditObject } from "../helper/types";
import type { Query } from "../helper/api/core";
import type Client from "../client";
import { assertKind } from "../helper/util";

/** @internal */
export interface Context {
  client: Client;
  post?: string;
  req?: { url: string; query: Query };
}

/** @internal */
export interface _Listing {
  after: string | null;
  before: string | null;
  children: RedditObject[];
  dist: number | null;
  modhash: string | null;
}

/** @internal */
export type ListingObject = RedditObject<_Listing>;

/** @internal */
export interface RedditMore {
  count: number;
  name: string;
  id: string;
  parent_id: string;
  depth: number;
  children: string[];
}

/** @internal */
export interface Fetcher<T> {
  fetch(ctx: Context): Promise<Listing<T>>;
}

/** @internal */
export abstract class Pager<T> implements Fetcher<T> {
  after: string;

  constructor(after: string) {
    this.after = after;
  }

  abstract fetch(ctx: Context): Promise<Listing<T>>;

  protected async nextPage(ctx: Context): Promise<_Listing> {
    if (!ctx.req) throw "Unable to fetch next page";
    const query = { limit: "100", after: this.after, ...ctx.req.query };
    const res: RedditObject = await ctx.client.get(ctx.req.url, query);
    assertKind("Listing", res);
    return res.data as _Listing;
  }
}

/**
 * A Listing of items.
 *
 * Listings are probably the most common data type on Reddit. Snoots
 * intentionally exposes as little as possible about the internal workings to
 * minimize the amount of boilerplate needed to interact with them.
 *
 * @note Since Reddit's responses are paged, Listings only implement asyncInterator.
 * This means that if you want to loop over it you have to use `for await`:
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
export default class Listing<T> {
  protected ctx: Context;
  protected arr: T[];
  protected fetcher?: Fetcher<T>;
  protected next?: Listing<T>;

  /** @internal */
  constructor(ctx: Context, arr: T[], fetcher?: Fetcher<T>) {
    this.ctx = ctx;
    this.arr = arr;
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
    if (this.arr.length > 0) return false;

    // If arr is empty with no way to get more, it's empty.
    if (!this.fetcher) return true;

    // This listing is empty but can fetch more. Do so, and if it was
    // successful, it's not empty.
    if (!this.next) {
      this.next = await this.fetcher.fetch(this.ctx);
    }
    return this.next.arr.length > 0;
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
   * @param fn The function to execute. If this returns or resolves to `false`
   * the execution will be halted.
   *
   * @returns A promise that resolves when the listing has been exausted.
   */
  async eachPage(fn: AwaitableFn<T[], boolean | void>): Promise<void> {
    let page: Listing<T> | null = this;

    do {
      // If the function returns false at any point, we are done.
      const res = await fn(page.arr);
      if (res === false) return;

      page = await Listing.nextPage(page, this.ctx);
    } while (page != null);
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
   *   return post.createdUtc >= Date.now() - 5 * 60 * 1000;
   * });
   * ```
   *
   * @param fn The function to execute. If this returns or resolves to `false`
   * the execution will be halted.
   *
   * @returns A promise that resolves when the iteration is complete.
   */
  async forEach(fn: AwaitableFn<T, boolean | void>): Promise<void> {
    for await (const el of this) {
      const res = await fn(el);
      if (res === false) break;
    }
  }

  /**
   * Determines whether the specified callback function returns true for any
   * element of the listing.
   *
   * @param fn The matcher to run on each element. If this returns `true` at any
   * point the searching is stopped.
   *
   * @returns A promise that resolves to `true` if `fn` returned `true` for some
   * element in the listing, or `false` if it reached the end of the listing.
   */
  async some(fn: AwaitableFn<T, boolean>): Promise<boolean> {
    for await (const el of this) {
      if (await fn(el)) return true;
    }
    return false;
  }

  /**
   * Get the first item of this listing.
   *
   * @returns A promise that resolves to either the first item of the listing,
   * or `null` if the listing is empty.
   */
  async first(): Promise<T | null> {
    for await (const el of this) {
      return el;
    }

    return null;
  }

  private static async nextPage<T>(
    page: Listing<T>,
    ctx: Context
  ): Promise<Listing<T> | null> {
    if (page.next) {
      return page.next;
    } else if (page.fetcher) {
      const next = await page.fetcher.fetch(ctx);
      return next.arr.length > 0 ? next : null;
    } else {
      return null;
    }
  }

  /** @internal */
  [Symbol.asyncIterator]() {
    return {
      page: this as Listing<T>,
      ctx: this.ctx,
      index: 0,

      async next(): Promise<IteratorResult<T>> {
        if (this.index >= this.page.arr.length) {
          const nextPage = await Listing.nextPage(this.page, this.ctx);
          if (!nextPage) return { done: true, value: undefined };
          this.page = nextPage;
          this.index = 0;
        }

        return { done: false, value: this.page.arr[this.index++] };
      },
    };
  }
}
