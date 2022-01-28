import type { _Listing } from "../listings/listing";
import type { Comment, Post, Subreddit } from "..";
import type { Data, PostSort, RedditObject } from "../helper/types";
import type { MyUserData, OtherUserData, UserData } from "../objects/user";
import type Client from "../client";
import type Listing from "../listings/listing";
import { camelCaseKeys, assertKind } from "../helper/util";
import { fakeListingAfter } from "../listings/util";
import { MyUser, OtherUser, User } from "../objects/user";
import BaseControls from "./base";
import CommentListing from "../listings/comment";
import PostListing from "../listings/post";

/**
 * Various methods to allow you to interact with users.
 *
 * @category Controls
 */
export default class UserControls extends BaseControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "u/");
  }

  /**
   * Fetch a user from Reddit.
   *
   * @note If the username you fetch is the same as the authorized user this
   * will return a {@link MyUser} instance. Otherwise it will be an instance of
   * {@link OtherUser}. To tell dynamically you can use {@link User.isMe}.
   *
   * @param username The name of the user to fetch.
   *
   * @returns The user.
   */
  async fetch(username: string): Promise<User> {
    const res: RedditObject = await this.client.get(`user/${username}/about`);
    return this.fromRaw(res);
  }

  /**
   * Fetch the details of the authorized user.
   *
   * @returns The user.
   */
  async fetchMe(): Promise<MyUser> {
    const res: Data = await this.client.get("api/v1/me");
    // /me doesn't return a wrapped object, so we have to make it ourselves.
    const raw: RedditObject = { kind: "t2", data: res };
    return this.fromRaw(raw) as MyUser;
  }

  /**
   * Fetch a user's subreddit.
   *
   * @param username The user who's subreddit to fetch.
   *
   * @returns A promise that resolves to the user's subreddit.
   */
  async fetchSubreddit(username: string): Promise<Subreddit> {
    return this.client.subreddits.fetch(`u_${username}`);
  }

  /**
   * Get a Listing of all the posts a user has made.
   *
   * @param username The user to get posts from.
   * @param sort How to sort the posts.
   *
   * @returns A sorted Listing of posts.
   */
  getPosts(username: string, sort: PostSort = "new"): Listing<Post> {
    const req = { url: `user/${username}/submitted`, query: { sort } };
    const ctx = { req, client: this.client };
    return new PostListing(fakeListingAfter(""), ctx);
  }

  /**
   * Get a Listing of all the comments a user has made.
   *
   * @param username The user to get comments from.
   * @param sort How to sort the comments.
   *
   * @returns A sorted Listing of comments.
   */
  getSortedComments(username: string, sort: string = "new"): Listing<Comment> {
    const req = { url: `user/${username}/comments`, query: { sort } };
    const ctx = { req, client: this.client };
    return new CommentListing(fakeListingAfter(""), ctx);
  }

  /** @internal */
  fromRaw(raw: RedditObject): User {
    assertKind("t2", raw);

    const rDat = raw.data;
    const data: UserData = camelCaseKeys(rDat);

    if ("coins" in rDat) {
      return new MyUser(this, data as MyUserData);
    } else {
      return new OtherUser(this, data as OtherUserData);
    }
  }
}
