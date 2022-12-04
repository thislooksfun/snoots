import type { Maybe } from "../../../helper/types";
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
import { PostComments } from "./post";

const debug = makeDebug("listing:comment");

function makeFetcher(
  after: RedditListing["after"],
  context: ListingContext
): Maybe<Fetcher<Comment>> {
  if (after == undefined) return undefined;

  if (after === "" && context.post) {
    // HACK: Some posts, notably the ones returned by search, don't have their
    // own comments listing. To ensure we can still get comments for those posts
    // we use a custom fetcher that just jump-starts the fetching process.
    return new PostComments();
  }

  return new CommentPager(after);
}

/** @internal */
export class CommentListing extends Listing<Comment> {
  constructor(l: RedditListing, context: ListingContext) {
    let fetcher: Maybe<Fetcher<Comment>>;

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

    fetcher ??= makeFetcher(l.after, context);

    super(context, comments, fetcher);
  }
}
