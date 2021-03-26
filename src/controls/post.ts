import type { _Listing, ListingObject } from "../listings/listing";
import type { RedditObject } from "../helper/types";
import type { PostData } from "../objects/post";
import type Client from "../client";
import { camelCaseKeys } from "../helper/util";
import { fakeListingAfter } from "../listings/util";
import CommentListing from "../listings/comment";
import Listing from "../listings/listing";
import Post from "../objects/post";
import PostListing from "../listings/post";
import VoteableControls from "./voteable";

/**
 * Various methods to allow you to interact with posts.
 *
 * @category Controls
 */
export default class PostControls extends VoteableControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "t3");
  }

  /**
   * Fetch a post.
   *
   * @param id The id of the post to fetch.
   *
   * @returns A promise that resolves to the request post.
   *
   * @throws
   */
  async fetch(id: string): Promise<Post> {
    const path = `comments/${id}`;
    const res: [ListingObject, ListingObject] = await this.client.get(path);
    return this.fromRaw(res[0].data.children[0], res[1].data);
  }

  /**
   * Distinguish a post.
   *
   * @param id The ID of the post to distinguish.
   *
   * @returns A promise that resolves when the post has been distinguished.
   */
  async distinguish(id: string): Promise<void> {
    const body = { how: "yes", sticky: false, id: this.namespace(id) };
    return this.client.post("api/distinguish", body);
  }

  /**
   * Undistinguish a post.
   *
   * @param id The ID of the post to undistinguish.
   *
   * @returns A promise that resolves when the post has been undistinguished.
   */
  async undistinguish(id: string): Promise<void> {
    const body = { how: "no", sticky: false, id: this.namespace(id) };
    return this.client.post("api/distinguish", body);
  }

  /**
   * Turn contest mode on/off.
   *
   * @param id The ID of the post to set contest mode for.
   * @param enabled Whether to turn contest mode on or off.
   *
   * @returns A promise that resolves when the post's contest mode has been
   * updated.
   */
  async setContestMode(id: string, enabled: boolean): Promise<void> {
    const body = { state: enabled, id: this.namespace(id) };
    await this.client.post("api/set_contest_mode", body);
  }

  /**
   * Get the duplicates of a post.
   *
   * This is the mechanism that drives the "View discussions in X other
   * communities" button on Reddit.
   *
   * @param id The ID of the post to get duplicates of.
   *
   * @returns A promise that resolves to a listing of posts.
   */
  async getDuplicates(id: string): Promise<Listing<Post>> {
    const path = `duplicates/${id}`;
    const res: [ListingObject, ListingObject] = await this.client.get(path);

    if (res[1].kind !== "Listing") throw "whoops.";

    const ctx = { client: this.client };
    return new PostListing(res[1].data, ctx);
  }

  /**
   * Hide a post, preventing it from appearing on most listings.
   *
   * @param id The ID of the post to hide.
   *
   * @returns A promise that resolves when the post has been hidden.
   */
  async hide(id: string) {
    return this.client.post("api/hide", { id: this.namespace(id) });
  }

  /**
   * Unhide a post, allowing it to appear on most listings.
   *
   * @param id The ID of the post to hide.
   *
   * @returns A promise that resolves when the post has been hidden.
   */
  async unhide(id: string) {
    return this.client.post("api/unhide", { id: this.namespace(id) });
  }

  /**
   * Lock a post, preventing non-moderators from being able to post comments.
   *
   * @param id The ID of the post to lock.
   *
   * @returns A promise that resolves when the post has been locked.
   */
  async lock(id: string) {
    return this.client.post("api/lock", { id: this.namespace(id) });
  }

  /**
   * Unlock a post, allowing non-moderators from being able to post comments.
   *
   * @param id The ID of the post to unlock.
   *
   * @returns A promise that resolves when the post has been unlocked.
   */
  async unlock(id: string) {
    return this.client.post("api/unlock", { id: this.namespace(id) });
  }

  /**
   * Mark a post as NSFW.
   *
   * @param id The ID of the post to mark NSFW.
   *
   * @returns A promise that resolves when the post has been marked as NSFW.
   */
  async markNsfw(id: string): Promise<void> {
    return this.client.post("api/marknsfw", { id: this.namespace(id) });
  }

  /**
   * Mark a post as not NSFW.
   *
   * @param id The ID of the post to unmark.
   *
   * @returns A promise that resolves when the post has been umarked.
   */
  async unmarkNsfw(id: string): Promise<void> {
    return this.client.post("api/unmarknsfw", { id: this.namespace(id) });
  }

  /**
   * Mark a post as a spoiler.
   *
   * @param id The ID of the post to mark as a spoler.
   *
   * @returns A promise that resolves when the post has been marked.
   */
  async markSpoiler(id: string): Promise<void> {
    return this.client.post("api/spoiler", { id: this.namespace(id) });
  }

  /**
   * Mark a post as not a spoiler.
   *
   * @param id The ID of the post to unmark.
   *
   * @returns A promise that resolves when the post has been umarked.
   */
  async unmarkSpoiler(id: string): Promise<void> {
    return this.client.post("api/unspoiler", { id: this.namespace(id) });
  }

  /** @internal */
  protected async setStickied(
    id: string,
    state: boolean,
    num?: 1 | 2
  ): Promise<void> {
    const body = { state, num, id: this.namespace(id) };
    return this.client.post("api/set_subreddit_sticky", body);
  }

  /**
   * Sticky a post.
   *
   * @param id The ID of the post to sticky.
   * @param num The slot to sticky the post to.
   *
   * @returns A promise that resolves when the post has been stickied.
   */
  async sticky(id: string, num: 1 | 2) {
    return this.setStickied(id, true, num);
  }

  /**
   * Unsticky a post.
   *
   * @param id The ID of the post to unsticky.
   *
   * @returns A promise that resolves when the post has been unstickied.
   */
  async unsticky(id: string) {
    return this.setStickied(id, false);
  }

  // /**
  //  * @summary Stickies this Submission.
  //  * @param {object} [options]
  //  * @param {number} [options.num=1] The sticky slot to put this submission in; this should be either 1 or 2.
  //  * @returns {Promise} The updated version of this Submission
  //  * @example r.getSubmission('2np694').sticky({num: 2})
  //  */
  // sticky({ num = 1 } = {}) {
  //   return this._setStickied({ state: true, num });
  // }
  // /**
  //  * @summary Unstickies this Submission.
  //  * @returns {Promise} The updated version of this Submission
  //  * @example r.getSubmission('2np694').unsticky()
  //  */
  // unsticky() {
  //   return this._setStickied({ state: false });
  // }

  /** @internal */
  fromRaw(raw: RedditObject, comments?: _Listing): Post {
    // TODO: Use a custom error type.
    if (raw.kind != "t3") throw `Invalid (expected t3, got ${raw.kind})`;

    const rDat = raw.data;
    const cmts = comments ?? fakeListingAfter("");
    const ctx = { post: rDat.id, client: this.client };
    rDat.comments = new CommentListing(cmts, ctx);

    rDat.body = rDat.selftext;
    rDat.bodyHtml = rDat.selftextHtml;

    const data: PostData = camelCaseKeys(rDat);

    return new Post(this, data);
  }
}
