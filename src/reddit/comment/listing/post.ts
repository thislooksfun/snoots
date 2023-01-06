import type {
  Fetcher,
  ListingContext,
  RedditObjectListing,
} from "../../listing/listing";
import type { RedditObject } from "../../types";
import type { Comment } from "../object";

import { emptyRedditListing } from "../../listing/util";
import { CommentListing } from "./listing";

/** @internal */
export class PostComments implements Fetcher<Comment> {
  async fetch(context: ListingContext): Promise<CommentListing> {
    if (!context.post) {
      // This should never happen, but just in case...
      throw new Error("Precondition failed: context.post is falsy");
    }

    const pth = `comments/${context.post}`;
    const childrenResponse: [unknown, RedditObject<RedditObjectListing>] =
      await context.client.gateway.get(pth, { comment: context.post });

    return new CommentListing(
      childrenResponse[1].data ?? emptyRedditListing(),
      context
    );
  }
}
