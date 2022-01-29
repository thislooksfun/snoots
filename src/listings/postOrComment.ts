import type { Comment, Post } from "../objects";
import type { Fetcher, ListingContext, RedditListing } from "./listing";

import { InvalidKindError } from "../helper/errors";
import Listing, { Pager } from "./listing";

class PostOrCommentPager extends Pager<Post | Comment> {
  async fetch(ctx: ListingContext): Promise<PostOrCommentListing> {
    const pg = await this.nextPage(ctx);
    return new PostOrCommentListing(pg, ctx);
  }
}

export default class PostOrCommentListing extends Listing<Post | Comment> {
  constructor(l: RedditListing, ctx: ListingContext) {
    let fetcher: Fetcher<Post | Comment> | undefined;

    if (l.after != null) {
      fetcher = new PostOrCommentPager(l.after);
    }

    const arr: (Post | Comment)[] = [];
    for (const c of l.children) {
      switch (c.kind) {
        case "t1":
          arr.push(ctx.client.comments.fromRaw(c));
          break;
        case "t3":
          arr.push(ctx.client.posts.fromRaw(c));
          break;
        default:
          throw new InvalidKindError("t1 or t3", c.kind);
      }
    }

    super(ctx, arr, fetcher);
  }
}
