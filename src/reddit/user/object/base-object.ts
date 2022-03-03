import type { Comment } from "../../comment/object";
import type { ContentData } from "../../content";
import type { Listing } from "../../listing/listing";
import type { Post } from "../../post/object";
import type { PostSort } from "../../post/types";
import type { Subreddit } from "../../subreddit/object";
import type { UserControls } from "../controls";
import type { UserItemsSort } from "../types";

import { Content } from "../../content";

// TODO: Deal with suspended users.
// Fetching a suspended user gives back very minimal data, meaning that this
// typing below is only a valid base for non-suspended users. I'm not sure what
// the best way to deal with this is...

/** The data for a single Reddit user. */
export interface UserData extends ContentData {
  /** The amount of karma this user has gotten from getting awards. */
  awardeeKarma: number;

  /** The amount of karma this user has gotten from giving awards. */
  awarderKarma: number;

  /** The total karma this user has gotten from comments. */
  commentKarma: number;

  /** Whether or not this user has subscribed to at least one subreddit. */
  hasSubscribed: boolean;

  /** Whether or not this user has a verified email. */
  hasVerifiedEmail: boolean;

  /** Whether or not this user should be hidden from search engine crawlers. */
  hideFromRobots: boolean;

  /** The URL of this user's avatar image. */
  iconImg: string;

  /** Whether or not this user is a Reddit employee. */
  isEmployee: boolean;

  /**
   * Whether or not this user is a friend of the authorized user.
   *
   * @note This is only provided if you use {@link UserControls.fetch}, *not* if
   * you use {@link UserControls.fetchMe}.
   */
  isFriend?: boolean;

  /** Whether or not this user currently has Reddit Premium */
  isGold: boolean;

  /** Whether or not this user is a moderator somewhere on Reddit. */
  isMod: boolean;

  /** The total karma this user has gotten from posts. */
  linkKarma: number;

  /** The user's name. */
  name: string;

  /** The total karma this user has. */
  totalKarma: number;

  /** Whether or not this user is verified. ??? */
  verified: boolean;
}

/**
 * Any Reddit user.
 *
 * If you need more information you can cast to either {@link MyUser} or, more
 * likely {@link OtherUser}. See {@link isMe} for more information.
 */
export abstract class User extends Content implements UserData {
  /**
   * Whether this user is the authorized user (instanceof {@link MyUser}) or not
   * (instanceof {@link OtherUser}).
   */
  abstract isMe: boolean;

  awardeeKarma: number;
  awarderKarma: number;
  commentKarma: number;
  hasSubscribed: boolean;
  hasVerifiedEmail: boolean;
  hideFromRobots: boolean;
  iconImg: string;
  isEmployee: boolean;
  isFriend?: boolean;
  isGold: boolean;
  isMod: boolean;
  linkKarma: number;
  name: string;
  totalKarma: number;
  verified: boolean;

  protected controls: UserControls;

  /** @internal */
  constructor(controls: UserControls, data: UserData) {
    super(data);
    this.controls = controls;

    this.awardeeKarma = data.awardeeKarma;
    this.awarderKarma = data.awarderKarma;
    this.commentKarma = data.commentKarma;
    this.hasSubscribed = data.hasSubscribed;
    this.hasVerifiedEmail = data.hasVerifiedEmail;
    this.hideFromRobots = data.hideFromRobots;
    this.iconImg = data.iconImg;
    this.isEmployee = data.isEmployee;
    this.isFriend = data.isFriend;
    this.isGold = data.isGold;
    this.isMod = data.isMod;
    this.linkKarma = data.linkKarma;
    this.name = data.name;
    this.totalKarma = data.totalKarma;
    this.verified = data.verified;
  }

  /**
   * Re-fetch this user.
   *
   * Note: This returns a _new object_, it is _not_ mutating.
   *
   * @returns A promise that resolves to the newly fetched user.
   */
  async refetch(): Promise<User> {
    return this.controls.fetch(this.name);
  }

  /**
   * Fetch the user subreddit for this user.
   *
   * @returns A promise that resolves to this user's subreddit.
   */
  async fetchSubreddit(): Promise<Subreddit> {
    // TODO: The user fetch does return some info about this subreddit, just not
    // enough to populate a full Subreddit instance. Is there some way we could
    // make use of that partial data?
    return this.controls.fetchSubreddit(this.name);
  }

  /**
   * Get a Listing of all the posts this user has made.
   *
   * @param sort How to sort the posts.
   *
   * @returns A sorted Listing of posts.
   */
  getPosts(sort: PostSort = "new"): Listing<Post> {
    return this.controls.getPosts(this.name, sort);
  }

  /**
   * Get a Listing of all the comments this user has made.
   *
   * @param sort How to sort the comments.
   *
   * @returns A sorted Listing of comments.
   */
  getSortedComments(sort: UserItemsSort = "new"): Listing<Comment> {
    return this.controls.getSortedComments(this.name, sort);
  }
}
