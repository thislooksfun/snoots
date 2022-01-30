import type Post from "../objects/post";
import type { Fetcher, ListingContext, RedditListing } from "./listing";

import Listing, { Pager } from "./listing";

class PostPager extends Pager<Post> {
  async fetch(context: ListingContext): Promise<PostListing> {
    const pg = await this.nextPage(context);
    return new PostListing(pg, context);
  }
}

/** @internal */
export default class PostListing extends Listing<Post> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Fetcher<Post> | undefined;

    if (l.after) {
      fetcher = new PostPager(l.after);
    }

    const posts: Post[] = [];
    for (const c of l.children) {
      posts.push(context.client.posts.fromRaw(c));
    }

    super(context, posts, fetcher);
  }
}
