import type { Comment } from "../../objects/comment";
import type {
  Fetcher,
  ListingContext,
  RedditListing,
  RedditMore,
} from "../listing";

import { Listing } from "../listing";
import { MoreComments } from "./more";
import { CommentPager } from "./pager";

/** @internal */
export class CommentListing extends Listing<Comment> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Fetcher<Comment> | undefined;

    if (l.after) {
      fetcher = new CommentPager(l.after);
    }

    const comments: Comment[] = [];
    for (const c of l.children) {
      switch (c.kind) {
        case "t1":
          comments.push(context.client.comments.fromRaw(c));
          break;
        case "more":
          fetcher = new MoreComments(c.data as RedditMore);
          break;
        default:
          console.dir(c);
          throw "Invalid item!";
      }
    }

    super(context, comments, fetcher);
  }
}
