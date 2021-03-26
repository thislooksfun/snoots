import type { Query } from "../helper/api/core";
import type { Awaitable, RedditObject } from "../helper/types";
import type Client from "../client";

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
    if (res.kind !== "Listing") throw "oh well that's not supposed to happen.";
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
   * Execute a function on each element of the listing.
   *
   * If the function returns or resolves to `false`, the execution will be
   * halted prematurely to allow breaking out in the middle of the iteration.
   *
   * @param fn The function to execute.
   *
   * @returns A promise that resolves when the listing has been exausted.
   */
  async each(fn: Awaitable<T, boolean | void>): Promise<void> {
    let page: Listing<T> | null = this;

    do {
      for (const el of page.arr) {
        // If the function returns false at any point, we are done.
        const res = await fn(el);
        if (res === false) return;
      }

      if (page.next) {
        page = page.next;
      } else if (page.fetcher) {
        page = await page.fetcher.fetch(this.ctx);
      } else {
        page = null;
      }
    } while (page != null);
  }
}
