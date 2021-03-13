import type { _Listing, RedditObject } from "../helper/types";
import type { CommentData } from "../objects/comment";
import type Client from "../client";
import { camelCaseKeys, fakeMoreListing } from "../helper/util";
import Comment from "../objects/comment";
import CommentListing from "../listings/comment";
import VoteableControls from "./voteable";

/**
 * Various methods to allow you to interact with comments.
 *
 * @category Controls
 */
export default class CommentControls extends VoteableControls {
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
    const res: RedditObject = await this.client.get("api/info", {
      id: this.name(id),
    });

    if (res.kind !== "Listing") {
      // TODO: Use a custom error type.
      throw "Invalid";
    }

    const list = res.data as _Listing;
    if (list.children.length < 1) {
      // TODO: Use a custom error type.
      throw "Not found";
    }

    const raw = list.children[0];
    return this.fromRaw(raw);
  }

  /** @internal */
  fromRaw(raw: RedditObject): Comment {
    if (raw.kind != this.type) {
      // TODO: Use a custom error type.
      throw `Invalid (expected ${this.type}, got ${raw.kind})`;
    }

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
