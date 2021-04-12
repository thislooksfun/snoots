import type { _Listing, ListingObject } from "../listings/listing";
import type { CommentData } from "../objects/comment";
import type { RedditObject } from "../helper/types";
import type { Client } from "../client";
import { camelCaseKeys, assertKind } from "../helper/util";
import { fakeMoreListing } from "../listings/util";
import { Comment } from "../objects/comment";
import { CommentListing } from "../listings/comment";
import { VoteableControls } from "./voteable";

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
export class CommentControls extends VoteableControls {
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
    const req = { id: this.namespace(id) };
    const res: ListingObject = await this.client.get("api/info", req);

    assertKind("Listing", res);

    const list = res.data;
    if (list.children.length < 1) {
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
    await this.client.post("api/distinguish", body);
  }

  /** @internal */
  fromRaw(raw: RedditObject): Comment {
    assertKind("t1", raw);

    const rDat = raw.data;
    const postId = rDat.link_id.slice(3);
    rDat.replies = this.listingifyReplies(rDat.replies, rDat.name, postId);
    const data: CommentData = camelCaseKeys(rDat);
    return new Comment(this, data);
  }

  /** @internal */
  protected listingifyReplies(
    replies: any,
    cmtName: string,
    postId: string
  ): CommentListing {
    const ctx = { post: postId, client: this.client };
    if (replies === "") {
      // Comments with no fetched replies have the replies key set to an empty
      // string. Convert it to a listing anyway.
      return new CommentListing(fakeMoreListing(cmtName), ctx);
    } else if ("kind" in replies) {
      switch (replies.kind) {
        case "Listing":
          return new CommentListing(replies.data, ctx);
        default:
          console.dir(replies);
          throw `Unknown type '${replies.kind}'`;
      }
    } else {
      console.dir(replies);
      throw "Unsupported reply type!";
    }
  }
}
