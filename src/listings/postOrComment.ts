import type { Comment, Post } from "../objects";
import type { Fetcher, ListingContext, RedditListing } from "./listing";

import { InvalidKindError } from "../helper/errors";
import { Listing, Pager } from "./listing";

class PostOrCommentPager extends Pager<Post | Comment> {
  async fetch(context: ListingContext): Promise<PostOrCommentListing> {
    const pg = await this.nextPage(context);
    return new PostOrCommentListing(pg, context);
  }
}

export class PostOrCommentListing extends Listing<Post | Comment> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Fetcher<Post | Comment> | undefined;

    if (l.after) {
      fetcher = new PostOrCommentPager(l.after);
    }

    const items: (Post | Comment)[] = [];
    for (const c of l.children) {
      switch (c.kind) {
        case "t1":
          items.push(context.client.comments.fromRaw(c));
          break;
        case "t3":
          items.push(context.client.posts.fromRaw(c));
          break;
        default:
          throw new InvalidKindError("t1 or t3", c.kind);
      }
    }

    super(context, items, fetcher);
  }
}
