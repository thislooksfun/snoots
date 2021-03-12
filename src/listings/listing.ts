import type { Data } from "../helper/types";
import type Client from "../client";
import { group } from "../helper/util";

/** @internal */
export interface Context {
  client: Client;
  post: string;
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
export abstract class More<T> {
  protected data: RedditMore;

  constructor(data: RedditMore) {
    this.data = data;
  }

  abstract fetch(ctx: Context): Promise<Listing<T>>;

  protected async more(ctx: Context): Promise<Data[]> {
    // api/morechildren has a max of 20 ids at a time, so we have to batch it.
    const children = this.data.children;
    const fetches = group(children, 20).map(c => {
      const query = { children: c.join(","), link_id: `t3_${ctx.post}` };
      return ctx.client.get<Data>("api/morechildren", query);
    });

    return Promise.all(fetches);
  }
}

/**
 * A function to be executed for each element in a Listing.
 *
 * If this function returns or resolves to `false` the iteration will be halted.
 *
 * @template T The type of data this will be passed.
 */
export type EachFn<T> = (t: T) => Promise<boolean | void> | boolean | void;

/**
 * A Listing of objects.
 *
 * Listings are probably the most common data type on Reddit. Snoots
 * intentionally exposes as little as possible about the internal workings to
 * minimize the amount of boilerplate needed to interact with them.
 *
 * @template T The type of objects this Listing holds.
 */
export default class Listing<T> {
  protected ctx: Context;
  protected arr: T[];
  protected more?: More<T>;
  protected next?: Listing<T>;

  /** @internal */
  constructor(ctx: Context, arr: T[], more?: More<T>) {
    this.ctx = ctx;
    this.arr = arr;
    this.more = more;
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
    if (!this.more) return true;

    // This listing is empty but can fetch more. Do so, and if it was
    // successful, it's not empty.
    if (!this.next) {
      this.next = await this.more.fetch(this.ctx);
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
    return !!this.more;
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
  async each(fn: EachFn<T>): Promise<void> {
    let page: Listing<T> | null = this;

    do {
      for (const el of page.arr) {
        // If the function returns false at any point, we are done.
        const res = await fn(el);
        if (res === false) return;
      }

      if (page.next) {
        page = page.next;
      } else if (page.more) {
        page = await page.more.fetch(this.ctx);
      } else {
        page = null;
      }
    } while (page != null);
  }
}
