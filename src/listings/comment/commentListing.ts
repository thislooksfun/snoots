import type {
  RedditListing,
  ListingContext,
  Fetcher,
  RedditMore,
} from "../listing";
import type Comment from "../../objects/comment";
import CommentPager from "./pager";
import Listing from "../listing";
import MoreComments from "./more";

/** @internal */
export default class CommentListing extends Listing<Comment> {
  constructor(l: RedditListing, ctx: ListingContext) {
    let fetcher: Fetcher<Comment> | undefined;

    if (l.after != null) {
      fetcher = new CommentPager(l.after);
    }

    const arr: Comment[] = [];
    for (const c of l.children) {
      switch (c.kind) {
        case "t1":
          arr.push(ctx.client.comments.fromRaw(c));
          break;
        case "more":
          fetcher = new MoreComments(c.data as RedditMore);
          break;
        default:
          console.dir(c);
          throw "Invalid item!";
      }
    }

    super(ctx, arr, fetcher);
  }
}
