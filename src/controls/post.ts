import type Client from "../client";
import type { Query } from "../gateway/types";
import type {
  Data,
  Maybe,
  RedditObject,
  SearchSort,
  SearchSyntax,
  TimeRange,
} from "../helper/types";
import type { ListingObject, RedditListing } from "../listings/listing";
import type { PostData } from "../objects/post";

import { assertKind, fromRedditData } from "../helper/util";
import CommentListing from "../listings/comment";
import Listing from "../listings/listing";
import PostListing from "../listings/post";
import { fakeListingAfter } from "../listings/util";
import Post from "../objects/post";
import { LinkPostOptions } from "./subreddit";
import VoteableControls from "./voteable";

function isRemoved(dat: Data) {
  if (dat.removed != undefined) return dat.removed;
  return !!dat.removal_reason || !!dat.removed_by || !!dat.removed_by_category;
}

/** @internal */
export type SplitRawPost = [ListingObject, ListingObject];

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
    const res: SplitRawPost = await this.gateway.get(path);
    return this.fromSplitRaw(res);
  }

  /**
   * Search Reddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param query The search query.
   * @param subreddit The subreddit to search in.
   * @param time The time range to search in.
   * @param sort The way to sort the search results.
   * @param syntax The search syntax to use.
   * @param restrictSr Whether or not to restrict the search to the given
   * subreddit. If this is `false` or if `subreddit` is falsy this will search
   * all of Reddit.
   *
   * @returns A listing of posts.
   */
  search(
    query: string,
    subreddit: Maybe<string>,
    time: TimeRange = "all",
    sort: SearchSort = "new",
    syntax: SearchSyntax = "plain",
    restrictSr: boolean = false
  ): Listing<Post> {
    const options: Query = {
      t: time,
      q: query,
      sort,
      syntax,
      restrict_sr: restrictSr && !!subreddit,
    };

    if (subreddit) options.subreddit = subreddit;

    const url = subreddit ? `r/${subreddit}/` : "";
    const req = { url: `${url}search`, query: options };
    const ctx = { req, client: this.client };
    return new PostListing(fakeListingAfter(""), ctx);
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
    await this.gateway.post("api/distinguish", body);
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
    await this.gateway.post("api/distinguish", body);
  }

  /**
   * Crosspost a post.
   *
   * @param id The ID of the post to crosspost.
   * @param subreddit The name of the subreddit to crosspost to.
   * @param title The title of the crosspost.
   * @param options Any extra options.
   *
   * * @returns A promise that resolves to the ID of the newly created post.
   */
  async crosspostTo(
    id: string,
    subreddit: string,
    title: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.client.subreddits.postCrosspost(subreddit, title, id, options);
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
    await this.gateway.post("api/set_contest_mode", body);
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
    const res: [ListingObject, ListingObject] = await this.gateway.get(path);

    assertKind("Listing", res[1]);

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
  async hide(id: string): Promise<void> {
    await this.gateway.post("api/hide", { id: this.namespace(id) });
  }

  /**
   * Unhide a post, allowing it to appear on most listings.
   *
   * @param id The ID of the post to hide.
   *
   * @returns A promise that resolves when the post has been hidden.
   */
  async unhide(id: string): Promise<void> {
    await this.gateway.post("api/unhide", { id: this.namespace(id) });
  }

  /**
   * Lock a post, preventing non-moderators from being able to post comments.
   *
   * @param id The ID of the post to lock.
   *
   * @returns A promise that resolves when the post has been locked.
   */
  async lock(id: string): Promise<void> {
    await this.gateway.post("api/lock", { id: this.namespace(id) });
  }

  /**
   * Unlock a post, allowing non-moderators from being able to post comments.
   *
   * @param id The ID of the post to unlock.
   *
   * @returns A promise that resolves when the post has been unlocked.
   */
  async unlock(id: string): Promise<void> {
    await this.gateway.post("api/unlock", { id: this.namespace(id) });
  }

  /**
   * Mark a post as NSFW.
   *
   * @param id The ID of the post to mark NSFW.
   *
   * @returns A promise that resolves when the post has been marked as NSFW.
   */
  async markNsfw(id: string): Promise<void> {
    await this.gateway.post("api/marknsfw", { id: this.namespace(id) });
  }

  /**
   * Mark a post as not NSFW.
   *
   * @param id The ID of the post to unmark.
   *
   * @returns A promise that resolves when the post has been umarked.
   */
  async unmarkNsfw(id: string): Promise<void> {
    await this.gateway.post("api/unmarknsfw", { id: this.namespace(id) });
  }

  /**
   * Mark a post as a spoiler.
   *
   * @param id The ID of the post to mark as a spoler.
   *
   * @returns A promise that resolves when the post has been marked.
   */
  async markSpoiler(id: string): Promise<void> {
    await this.gateway.post("api/spoiler", { id: this.namespace(id) });
  }

  /**
   * Mark a post as not a spoiler.
   *
   * @param id The ID of the post to unmark.
   *
   * @returns A promise that resolves when the post has been umarked.
   */
  async unmarkSpoiler(id: string): Promise<void> {
    await this.gateway.post("api/unspoiler", { id: this.namespace(id) });
  }

  /** @internal */
  protected async setStickied(
    id: string,
    state: boolean,
    num?: 1 | 2
  ): Promise<void> {
    const body = { state, num, id: this.namespace(id) };
    await this.gateway.post("api/set_subreddit_sticky", body);
  }

  /**
   * Sticky a post.
   *
   * @param id The ID of the post to sticky.
   * @param num The slot to sticky the post to.
   *
   * @returns A promise that resolves when the post has been stickied.
   */
  async sticky(id: string, num: 1 | 2): Promise<void> {
    await this.setStickied(id, true, num);
  }

  /**
   * Unsticky a post.
   *
   * @param id The ID of the post to unsticky.
   *
   * @returns A promise that resolves when the post has been unstickied.
   */
  async unsticky(id: string): Promise<void> {
    await this.setStickied(id, false);
  }

  /** @internal */
  fromSplitRaw(raw: SplitRawPost): Post {
    return this.fromRaw(raw[0].data.children[0], raw[1].data);
  }

  /** @internal */
  fromRaw(raw: RedditObject, comments?: RedditListing): Post {
    assertKind("t3", raw);

    const rDat = raw.data;
    const cmts = comments ?? fakeListingAfter("");
    const ctx = { post: rDat.id, client: this.client };
    rDat.comments = new CommentListing(cmts, ctx);

    rDat.body = rDat.selftext;
    rDat.bodyHtml = rDat.selftextHtml;

    rDat.removed = isRemoved(rDat);

    const data: PostData = fromRedditData(rDat);

    return new Post(this, data);
  }
}
