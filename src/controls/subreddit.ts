import type Client from "../client";
import type { Query } from "../gateway/types";
import type {
  Data,
  PostSort,
  RedditObject,
  SearchSort,
  SearchSyntax,
  TimeRange,
} from "../helper/types";
import type Listing from "../listings/listing";
import type { Comment, Post } from "../objects";
import type { SubredditData } from "../objects/subreddit";
import type { SplitRawPost } from "./post";

import { assertKind, fromRedditData } from "../helper/util";
import CommentListing from "../listings/comment";
import PostListing from "../listings/post";
import PostOrCommentListing from "../listings/postOrComment";
import { fakeListingAfter } from "../listings/util";
import Subreddit from "../objects/subreddit";
import BaseControls from "./base";

/** A single capcha identifier and response. */
export interface Capcha {
  /** The identifier of the capcha. */
  iden: string;
  /** The response to the capcha. */
  response: string;
}

/** Extra options regarding bans. */
export interface BanOptions {
  /** How long to ban the user for, in days. Omit this for a permanent ban. */
  duration?: number;

  /** The ban message. This will be sent to the user. */
  message?: string;

  /**
   * A note to the other moderators about why this user was banned (max 300
   * characters).
   */
  note?: string;

  /** The reason for the ban (max 100 characters). */
  reason?: string;
}

/** Extra options for submitting a post. */
export interface TextPostOptions {
  /**
   * Whether or not to send inbox replies for the new post (defaults to `true`).
   *
   * If you want to change this later you can use
   * {@link Post.enableInboxReplies} and {@link Post.disableInboxReplies}.
   */
  sendReplies?: boolean;

  /**
   * The capcha information. This is only necessary if the authenticated account
   * requires a captcha to submit posts and comments.
   */
  captcha?: Capcha;

  /** Whether or not this post is NSFW (defaults to `false`). */
  nsfw?: boolean;

  /** Whether or not this post is a spoiler (defaults to `false`). */
  spoiler?: boolean;
}

/** Extra options for submitting a link post. */
export interface LinkPostOptions extends TextPostOptions {
  /**
   * Whether or not to error if this link has been submitted before (defaults to
   * `false`).
   */
  unique?: boolean;
}

type PostTypes = "self" | "link" | "crosspost";
interface PostOptions {
  kind: PostTypes;
  title: string;
  text?: string;
  url?: string;
  crosspostFullname?: string;
  sendReplies: boolean;
  captcha?: Capcha;
  nsfw: boolean;
  spoiler: boolean;
  // This only applies to link and cross posts
  resubmit: boolean;
}

/**
 * Various methods to allow you to interact with subreddits.
 *
 * @category Controls
 */
export default class SubredditControls extends BaseControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "r/");
  }

  /**
   * Fetch a subreddit.
   *
   * @param subreddit The name of the subreddit to fetch.
   *
   * @returns A promise that resolves to the requested subreddit.
   */
  async fetch(subreddit: string): Promise<Subreddit> {
    const res: RedditObject = await this.gateway.get(`r/${subreddit}/about`);
    return this.fromRaw(res);
  }

  /**
   * Accept a moderator invite.
   *
   * @param sr The name of the subreddit to accept the invite for.
   *
   * @returns A promise that resolves when the invite has been accepted.
   */
  async acceptModeratorInvite(sr: string): Promise<void> {
    await this.gateway.post(`r/${sr}/api/accept_moderator_invite`, {});
  }

  /**
   * Add an approved poster.
   *
   * @param sr The name of the subreddit to add the contributor to.
   * @param name The username of the user to add.
   *
   * @returns A promise that resolves when the contributor has been added.
   */
  async addContributor(sr: string, name: string): Promise<void> {
    await this.friend(sr, name, "contributor");
  }

  /**
   * Remove an approved poster.
   *
   * @param sr The name of the subreddit to remove the contributor from.
   * @param name The username of the user to remove.
   *
   * @returns A promise that resolves when the contributor has been removed.
   */
  async removeContributor(sr: string, name: string): Promise<void> {
    await this.unfriend(sr, name, "contributor");
  }

  /** @internal */
  async leaveContributor(srId: string): Promise<void> {
    await this.gateway.post("api/leavecontributor", { id: srId });
  }

  /**
   * Add a user to the list of approved wiki editors.
   *
   * @param sr The name of the subreddit to add the user to.
   * @param name The username of the user to add.
   *
   * @returns A promise that resolves when the wiki editor has been added.
   */
  async addWikiContributor(sr: string, name: string): Promise<void> {
    await this.friend(sr, name, "wikicontributor");
  }

  /**
   * Remove a user from the list of approved wiki editors.
   *
   * @param sr The name of the subreddit to remove the user from.
   * @param name The username of the user to remove.
   *
   * @returns A promise that resolves when the wiki editor has been removed.
   */
  async removeWikiContributor(sr: string, name: string): Promise<void> {
    await this.unfriend(sr, name, "wikicontributor");
  }

  /**
   * Ban a user from a subreddit.
   *
   * @param sr The name of the subreddit to ban the user from.
   * @param name The username of the user to ban.
   * @param options Any additional options for the ban.
   *
   * @returns A promise that resolves when the user has been banned.
   */
  async banUser(
    sr: string,
    name: string,
    options: BanOptions = {}
  ): Promise<void> {
    const friendOptions: Query = {};
    if (options.duration != undefined)
      friendOptions.duration = "" + options.duration;
    if (options.message != undefined)
      friendOptions.ban_message = options.message;
    if (options.note != undefined) friendOptions.note = options.note;
    if (options.reason != undefined) friendOptions.ban_reason = options.reason;

    await this.friend(sr, name, "banned", friendOptions);
  }

  /**
   * Unan a user from a subreddit.
   *
   * @param sr The name of the subreddit to unban the user from.
   * @param name The username of the user to unban.
   *
   * @returns A promise that resolves when the user has been unbanned.
   */
  async unbanUser(sr: string, name: string): Promise<void> {
    await this.unfriend(sr, name, "banned");
  }

  /** @internal */
  protected getSortedPosts(
    subreddit: string | undefined,
    sort: PostSort,
    query: Query = {}
  ): Listing<Post> {
    const url = subreddit ? `r/${subreddit}/` : "";
    const req = { url: `${url}${sort}`, query: { show: "all", ...query } };
    const ctx = { req, client: this.client };
    return new PostListing(fakeListingAfter(""), ctx);
  }

  /**
   * Get the posts in a subreddit, sorted by new.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A listing of posts, with the newest ones first.
   */
  getNewPosts(subreddit?: string): Listing<Post> {
    return this.getSortedPosts(subreddit, "new");
  }

  /**
   * Get the posts in a subreddit, sorted by top.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   * @param time The time scale to filter by.
   *
   * @returns A listing of posts, with the top rated ones first.
   */
  getTopPosts(subreddit?: string, time: TimeRange = "all"): Listing<Post> {
    return this.getSortedPosts(subreddit, "top", { time });
  }

  /**
   * Get the posts in a subreddit, sorted by hot.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A listing of posts, with the hottest ones first.
   */
  getHotPosts(subreddit?: string): Listing<Post> {
    return this.getSortedPosts(subreddit, "hot");
  }

  /**
   * Get the posts in a subreddit, sorted by rising.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A listing of posts, with the rising ones first.
   */
  getRisingPosts(subreddit?: string): Listing<Post> {
    return this.getSortedPosts(subreddit, "hot");
  }

  /**
   * Get the posts in a subreddit, sorted by controversial.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   * @param time The time scale to filter by.
   *
   * @returns A listing of posts, with the most controversial ones first.
   */
  getControversialPosts(
    subreddit?: string,
    time: TimeRange = "all"
  ): Listing<Post> {
    return this.getSortedPosts(subreddit, "controversial", { time });
  }

  /** @internal */
  protected getAboutListing(sr: string, ext: string): Listing<Comment | Post> {
    const req = { url: `r/${sr}/about/${ext}`, query: {} };
    const ctx = { req, client: this.client };
    return new PostOrCommentListing(fakeListingAfter(""), ctx);
  }

  /** @internal */
  protected getAboutListingComments(sr: string, ext: string): Listing<Comment> {
    const req = { url: `r/${sr}/about/${ext}`, query: { only: "comments" } };
    const ctx = { req, client: this.client };
    return new CommentListing(fakeListingAfter(""), ctx);
  }

  /** @internal */
  protected getAboutListingPosts(sr: string, ext: string): Listing<Post> {
    const req = { url: `r/${sr}/about/${ext}`, query: { only: "links" } };
    const ctx = { req, client: this.client };
    return new PostListing(fakeListingAfter(""), ctx);
  }

  /**
   * Get the list of items that have been removed from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have been removed.
   */
  getSpam(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "spam");
  }

  /**
   * Get the list of comments that have been removed from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have been removed.
   */
  getSpamComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "spam");
  }

  /**
   * Get the list of posts that have been removed from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have been removed.
   */
  getSpamPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "spam");
  }

  /**
   * Get the list of items that have been edited from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have been edited.
   */
  getEdited(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "edited");
  }

  /**
   * Get the list of comments that have been edited from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have been edited.
   */
  getEditedComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "edited");
  }

  /**
   * Get the list of posts that have been edited from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have been edited.
   */
  getEditedPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "edited");
  }

  /**
   * Get the list of items that have been reported from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have been reported.
   */
  getReported(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "reports");
  }

  /**
   * Get the list of comments that have been reported from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have been reported.
   */
  getReportedComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "reports");
  }

  /**
   * Get the list of posts that have been reported from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have been reported.
   */
  getReportedPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "reports");
  }

  /**
   * Get the list of items that have not been moderated from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have not been moderated.
   */
  getUnmoderated(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "unmoderated");
  }

  /**
   * Get the list of comments that have not been moderated from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have not been moderated.
   */
  getUnmoderatedComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "unmoderated");
  }

  /**
   * Get the list of posts that have not been moderated from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have not been moderated.
   */
  getUnmoderatedPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "unmoderated");
  }

  /**
   * Get the list of items that are in the modqueue of a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that are in the modqueue.
   */
  getModqueue(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "modqueue");
  }

  /**
   * Get the list of comments that are in the modqueue of a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that are in the modqueue.
   */
  getModqueueComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "modqueue");
  }

  /**
   * Get the list of posts that are in the modqueue of a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that are in the modqueue.
   */
  getModqueuePosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "modqueue");
  }

  /**
   * Get a random post.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A promise that resolves to a random post.
   */
  async getRandomPost(subreddit?: string): Promise<Post> {
    const base = subreddit ? `r/${subreddit}/` : "";
    const url = `${base}random`;
    const res: SplitRawPost = await this.gateway.get(url);
    return this.client.posts.fromSplitRaw(res);
  }

  /**
   * Search in a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The subreddit to search in.
   * @param query The search query.
   * @param time The time range to search in.
   * @param sort The way to sort the search results.
   * @param syntax The search syntax to use.
   *
   * @returns A listing of posts.
   */
  search(
    subreddit: string,
    query: string,
    time: TimeRange = "all",
    sort: SearchSort = "relevance",
    syntax: SearchSyntax = "plain"
  ): Listing<Post> {
    return this.client.posts.search(query, subreddit, time, sort, syntax, true);
  }

  // TODO: allow other sorting
  /**
   * Get a Listing of all the comments in a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The subreddit to get comments from. If this is not
   * provided comments will be fetched from the front page of Reddit.
   * @param sort How to sort the comments.
   *
   * @returns A sorted Listing of comments.
   */
  getSortedComments(subreddit: string, sort: "new" = "new"): Listing<Comment> {
    const url = subreddit ? `r/${subreddit}/` : "";
    const req = { url: `${url}${sort}`, query: { sort } };
    const ctx = { req, client: this.client };
    return new CommentListing(fakeListingAfter(""), ctx);
  }

  /**
   * Submit a text post.
   *
   * @param subreddit The subreddit to submit the post to.
   * @param title The title of the post.
   * @param body The body of the post.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postText(
    subreddit: string,
    title: string,
    body?: string,
    options: TextPostOptions = {}
  ): Promise<string> {
    return this.post(subreddit, {
      kind: "self",
      title,
      text: body,
      sendReplies: options.sendReplies ?? false,
      resubmit: true,
      captcha: options.captcha,
      nsfw: options.nsfw ?? false,
      spoiler: options.spoiler ?? false,
    });
  }

  /**
   * Submit a link post.
   *
   * @param subreddit The subreddit to submit the post to.
   * @param title The title of the post.
   * @param url The url to link to.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postLink(
    subreddit: string,
    title: string,
    url: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.post(subreddit, {
      kind: "link",
      title,
      url,
      sendReplies: options.sendReplies ?? false,
      resubmit: !options.unique,
      captcha: options.captcha,
      nsfw: options.nsfw ?? false,
      spoiler: options.spoiler ?? false,
    });
  }

  /**
   * Submit a crosspost.
   *
   * @param subreddit The subreddit to submit the post to.
   * @param title The title of the post.
   * @param postID The ID of the post to crosspost.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postCrosspost(
    subreddit: string,
    title: string,
    postID: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.post(subreddit, {
      kind: "crosspost",
      title,
      crosspostFullname: `t3_${postID}`,
      sendReplies: options.sendReplies ?? false,
      resubmit: !options.unique,
      captcha: options.captcha,
      nsfw: options.nsfw ?? false,
      spoiler: options.spoiler ?? false,
    });
  }

  // TODO: Support 'oc' and flairs.
  protected async post(
    subreddit: string,
    options: PostOptions
  ): Promise<string> {
    const req: Data = {
      sr: subreddit,
      kind: options.kind,
      title: options.title,
      sendreplies: options.sendReplies,
      resubmit: options.resubmit,
      nsfw: options.nsfw,
      spoiler: options.spoiler,
    };

    if (options.text != undefined) req.text = options.text;
    if (options.url != undefined) req.url = options.url;
    if (options.crosspostFullname != undefined)
      req.crosspost_fullname = options.crosspostFullname;
    if (options.captcha != undefined) {
      req.captcha = options.captcha.response;
      req.iden = options.captcha.iden;
    }

    const res: Data = await this.gateway.post("api/submit", req);
    return res.id;
  }

  /** @internal */
  protected async friend(
    sr: string,
    name: string,
    type: string,
    options: Query = {}
  ) {
    await this.gateway.post(`r/${sr}/api/friend`, { ...options, name, type });
  }

  /** @internal */
  protected async unfriend(
    sr: string,
    name: string,
    type: string,
    options: Query = {}
  ) {
    await this.gateway.post(`r/${sr}/api/unfriend`, { ...options, name, type });
  }

  /** @internal */
  fromRaw(raw: RedditObject): Subreddit {
    assertKind("t5", raw);

    const rDat = raw.data;
    rDat.sidebar = rDat.description;
    rDat.sidebar_html = rDat.description_html;
    rDat.description = rDat.public_description;
    rDat.description_html = rDat.public_description_html;
    const data: SubredditData = fromRedditData(rDat);
    return new Subreddit(this, data);
  }
}
