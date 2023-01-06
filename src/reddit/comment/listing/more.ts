import type { Data } from "../../../helper/types";
import type {
  Fetcher,
  ListingContext,
  RedditMore,
  RedditObjectListing,
} from "../../listing/listing";
import type { RedditObject } from "../../types";
import type { Comment } from "../object";

import { emptyRedditListing } from "../../listing/util";
import { CommentListing } from "./listing";

function fixCommentTree(objects: RedditObject[]) {
  // Map the items by their name.
  const map: Record<string, RedditObject> = {};
  for (const item of objects) {
    if (!item.data.name) throw "Hmm...";
    map[item.data.name as string] = item;

    // Ensure that all the comments have a replies listing.
    if (item.kind === "t1") {
      if (item.data.replies !== "") throw "?????";
      item.data.replies = { kind: "Listing", data: { children: [] } };
    }
  }

  // Build up the tree.
  const tree: RedditObject[] = [];
  for (const item of objects) {
    const parent = map[item.data.parent_id as string];
    if (parent) {
      const parentReplies = parent.data
        .replies as RedditObject<RedditObjectListing>;
      parentReplies.data.children.push(item);
    } else if (item.kind === "t1") {
      tree.push(item);
    }
  }

  return tree;
}

/** @internal */
export class MoreComments implements Fetcher<Comment> {
  protected data: RedditMore;

  constructor(data: RedditMore) {
    this.data = data;
  }

  async fetch(context: ListingContext): Promise<CommentListing> {
    if (!context.post) {
      // This should never happen, but just in case...
      throw new Error("Precondition failed: context.post is falsy");
    }

    if (this.data.name === "t1__") {
      const id = this.data.parent_id.slice(3);
      const pth = `comments/${context.post}`;
      const childrenResponse: [unknown, RedditObject<RedditObjectListing>] =
        await context.client.gateway.get(pth, {
          comment: id,
        });

      const child = childrenResponse[1].data.children[0];
      if (!child) return new CommentListing(emptyRedditListing(), context);

      const replies = child.data.replies as RedditObject<RedditObjectListing>;
      return new CommentListing(replies.data ?? emptyRedditListing(), context);
    } else {
      // api/morechildren can't handle more than ~75 items at a time, so we have
      // to batch it. Yes the docs *say* 100, but if we do that we start losing
      // items.
      const page = this.data.children.slice(0, 75);
      const rest = this.data.children.slice(75);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const query = { children: page.join(","), link_id: `t3_${context.post}` };
      const childrenResponse: Data = await context.client.gateway.get(
        "api/morechildren",
        query
      );

      const rawChildren = childrenResponse.things as RedditObject[];
      const children = fixCommentTree(rawChildren);

      // If there are more children, put another More at the end of the list.
      if (rest.length > 0) {
        const more: RedditObject<RedditMore> = {
          kind: "more",
          data: {
            // I have no clue if this count calculation is correct, but it's not
            // currently being used anyway, so... ¯\_(ツ)_/¯
            count: this.data.count - rawChildren.length,
            depth: this.data.depth,
            children: rest,
            id: rest[0],
            name: `t1_${rest[0]}`,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            parent_id: this.data.parent_id,
          },
        };

        children.push(more);
      }

      return new CommentListing({ children }, context);
    }
  }
}
