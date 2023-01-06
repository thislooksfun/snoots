import type { Client } from "../../client";
import type { RedditObjectListing } from "../listing/listing";
import type { RedditObject } from "../types";
import type { CommentData } from "./object";

import { makeDebug } from "../../helper/debug";
import { fakeMoreListing } from "../listing/util";
import { LockableControls } from "../lockable/controls";
import { assertKind, fromRedditData } from "../util";
import { CommentListing } from "./listing/listing";
import { Comment } from "./object";

const debug = makeDebug("controls:comment");

/**
 * The ways to distinguish a comment.
 *
 * Note that due to the way Reddit works, a comment cannot be sticky without
 * also being mod-distinguished. For that reason setting `sticky` will also set
 * `mod`.
 */
export type DistinguishStates = "none" | "mod" | "sticky";

/**
 * Various methods to allow you to interact with comments.
 *
 * @category Controls
 */
export class CommentControls extends LockableControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "t1");
  }

  /**
   * Fetch a comment.
   *
   * @param id The id of the comment to fetch.
   *
   * @returns A promise that resolves to the request comment.
   *
   * @throws If the comment couldn't be found.
   */
  async fetch(id: string): Promise<Comment> {
    const listingObject: RedditObject<RedditObjectListing> =
      await this.gateway.get("api/info", {
        id: this.namespace(id),
      });

    assertKind("Listing", listingObject);

    const list = listingObject.data;
    if (list.children.length === 0) {
      // TODO: Use a custom error type.
      throw "Not found";
    }

    const raw = list.children[0];
    return this.fromRaw(raw);
  }

  /**
   * Distinguish a comment.
   *
   * @param id The ID of the comment to distinguish.
   * @param state How the comment should be distinguished.
   *
   * @returns A promise that resolves when the comment has been distinguished.
   */
  async distinguish(id: string, state: DistinguishStates): Promise<void> {
    const how = state === "none" ? "no" : "yes";
    const sticky = state === "sticky";

    const body = { how, sticky, id: this.namespace(id) };
    await this.gateway.post("api/distinguish", body);
  }

  /** @internal */
  fromRaw(raw: RedditObject): Comment {
    assertKind("t1", raw);

    const rDat = raw.data;
    const postId = (rDat.link_id as string).slice(3);
    const postName = rDat.name as string;
    rDat.replies = this.convertRepliesToListing(rDat.replies, postName, postId);
    const data: CommentData = fromRedditData(rDat);
    return new Comment(this, data);
  }

  /** @internal */
  protected convertRepliesToListing(
    replies: unknown,
    cmtName: string,
    postId: string
  ): CommentListing {
    const context = { post: postId, client: this.client };
    if (replies === "") {
      // Comments with no fetched replies have the replies key set to an empty
      // string. Convert it to a listing anyway.
      return new CommentListing(fakeMoreListing(cmtName), context);
    } else if (replies && typeof replies === "object" && "kind" in replies) {
      const repliesObject = replies as RedditObject;
      assertKind("Listing", repliesObject);
      return new CommentListing(
        (repliesObject as RedditObject<RedditObjectListing>).data,
        context
      );
    } else {
      debug("Replies are of unsupported type; %O", replies);
      throw "Unsupported reply type!";
    }
  }
}
