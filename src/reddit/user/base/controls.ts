import type { Client } from "../../../client";
import type { Comment } from "../../comment/object";
import type { Listing } from "../../listing/listing";
import type { Post } from "../../post/object";
import type { PostSort } from "../../post/types";
import type { Subreddit } from "../../subreddit/object";
import type { RedditObject } from "../../types";
import type { MyUserData } from "../my-user/object";
import type { OtherUserData } from "../other-user/object";
import type { UserItemsSort } from "../types";
import type { User, UserData } from "./object";

import { BaseControls } from "../../base-controls";
import { CommentListing } from "../../comment/listing/listing";
import { fakeListingAfter } from "../../listing/util";
import { PostListing } from "../../post/listing";
import { assertKind, fromRedditData } from "../../util";
import { MyUser } from "../my-user/object";
import { OtherUser } from "../other-user/object";

/**
 * The base controls for interacting with users.
 *
 * @category Controls
 */
export class BaseUserControls extends BaseControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "u/");
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
    const request = { url: `user/${username}/submitted`, query: { sort } };
    const context = { request, client: this.client };
    return new PostListing(fakeListingAfter(""), context);
  }

  /**
   * Get a Listing of all the comments a user has made.
   *
   * @param username The user to get comments from.
   * @param sort How to sort the comments.
   *
   * @returns A sorted Listing of comments.
   */
  getSortedComments(
    username: string,
    sort: UserItemsSort = "new"
  ): Listing<Comment> {
    const request = { url: `user/${username}/comments`, query: { sort } };
    const context = { request, client: this.client };
    return new CommentListing(fakeListingAfter(""), context);
  }

  /** @internal */
  fromRaw(raw: RedditObject): User {
    assertKind("t2", raw);

    const rDat = raw.data;
    const data: UserData = fromRedditData(rDat);

    // "coins" is only set in the personal user response.
    return "coins" in rDat
      ? new MyUser(this.client.me, data as MyUserData)
      : new OtherUser(this.client.users, data as OtherUserData);
  }
}
