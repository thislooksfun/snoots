import type {
  Fetcher,
  ListingContext,
  RedditListing,
  RedditMore,
} from "../../listing/listing";
import type { Comment } from "../object";

import { makeDebug } from "../../../helper/debug";
import { Listing } from "../../listing/listing";
import { MoreComments } from "./more";
import { CommentPager } from "./pager";

const debug = makeDebug("listing:comment");

/** @internal */
export class CommentListing extends Listing<Comment> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Fetcher<Comment> | undefined;

    if (context.post) {
      fetcher = new MoreComments({
        children: [],
        count: 0,
        depth: 0,
        id: "_",
        name: "t1__",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        parent_id: context.client.posts.namespace(context.post),
      });
    } else if (l.after != undefined) {
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
          debug("Invalid child %O", c);
          throw "Invalid item!";
      }
    }

    super(context, comments, fetcher);
  }
}
