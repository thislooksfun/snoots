import type Post from "../objects/post";
import type { Fetcher, ListingContext, RedditListing } from "./listing";

import Listing, { Pager } from "./listing";

class PostPager extends Pager<Post> {
  async fetch(ctx: ListingContext): Promise<PostListing> {
    const pg = await this.nextPage(ctx);
    return new PostListing(pg, ctx);
  }
}

/** @internal */
export default class PostListing extends Listing<Post> {
  constructor(l: RedditListing, ctx: ListingContext) {
    let fetcher: Fetcher<Post> | undefined;

    if (l.after != null) {
      fetcher = new PostPager(l.after);
    }

    const arr: Post[] = [];
    for (const c of l.children) {
      arr.push(ctx.client.posts.fromRaw(c));
    }

    super(ctx, arr, fetcher);
  }
}
