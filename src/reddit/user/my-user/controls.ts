import type { Data } from "../../../helper/types";
import type { Listing } from "../../listing/listing";
import type { Subreddit } from "../../subreddit/object";
import type { RedditObject } from "../../types";
import type { MyUser } from "./object";

import { BaseUserControls } from "../base/controls";

/**
 * Various methods to allow you to interact with the authorized user.
 *
 * @category Controls
 */
export class MyUserControls extends BaseUserControls {
  /**
   * Fetch the details of the authorized user.
   *
   * @returns The user.
   */
  async fetch(): Promise<MyUser> {
    const userData: Data = await this.gateway.get("api/v1/me");
    // /me doesn't return a wrapped object, so we have to make it ourselves.
    const raw: RedditObject = { kind: "t2", data: userData };
    return this.client.users.fromRaw(raw) as MyUser;
  }

  /** @internal */
  protected getMySubreddits(where: string): Listing<Subreddit> {
    return this.client.subreddits["getSubreddits"](`mine/${where}`);
  }

  /**
   * Get the subreddits the authenticated account is a contributor in.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 subreddits.
   *
   * @returns A Listing of Subreddits.
   */
  getContributorSubreddits(): Listing<Subreddit> {
    return this.getMySubreddits("contributor");
  }

  /**
   * Get the subreddits the authenticated account is a moderator in.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 subreddits.
   *
   * @returns A Listing of Subreddits.
   */
  getModeratedSubreddits(): Listing<Subreddit> {
    return this.getMySubreddits("moderator");
  }
}
