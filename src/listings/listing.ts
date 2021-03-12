import type { Data } from "../helper/types";
import type Client from "../client";
import { group } from "../helper/util";

export interface Context {
  client: Client;
  post: string;
}

export interface RedditMore {
  count: number;
  name: string;
  id: string;
  parent_id: string;
  depth: number;
  children: string[];
}

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

/** A function to be executed for each element in a Listing. */
export type EachFn<T> = (t: T) => Promise<boolean | void> | boolean | void;

/** A listing of objects. */
export default class Listing<T> {
  protected ctx: Context;
  protected arr: T[];
  protected more?: More<T>;
  protected next?: Listing<T>;

  /**
   * Create a new listing.
   *
   * @internal
   */
  constructor(ctx: Context, arr: T[], more?: More<T>) {
    this.ctx = ctx;
    this.arr = arr;
    this.more = more;
  }

  /**
   * Whether or not this listing is empty.
   *
   * @returns A promise that resolves to true iff the listing is empty.
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
   * @returns True iff the listing can fetch more.
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
