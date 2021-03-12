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
   * TODO: Throw custom error if comment wasn't found.
   * @throws
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

  /**
   * Convert the 'replies' parameter to a Listing.
   *
   * @param replies The replies to convert.
   *
   * @returns The converted Listing.
   */
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

    // TODO:
    // /* If a comment is in a deep comment chain, reddit will send a single `more` object with name `t1__` in place of the
    //   comment's replies. This is the equivalent of seeing a 'Continue this thread' link on the HTML site, and it indicates that
    //   replies should be fetched by sending another request to view the deep comment alone, and parsing the replies from that. */
    // if (
    //   this.replies instanceof Listing &&
    //   !this.replies.length &&
    //   this.replies._more &&
    //   this.replies._more.name === "t1__"
    // ) {
    //   this.replies = getEmptyRepliesListing(this);
    // } else if (this.replies._more && !this.replies._more.link_id) {
    //   this.replies._more.link_id = this.link_id;
    // }
  }
}
