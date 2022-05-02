import type { RedditObject } from "../../types";
import type { User } from "../base/object";

import { BaseUserControls } from "../base/controls";

/**
 * Various methods to allow you to interact with users.
 *
 * @category Controls
 */
export class UserControls extends BaseUserControls {
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
    const raw: RedditObject = await this.gateway.get(`user/${username}/about`);
    return this.fromRaw(raw);
  }

  /**
   * Check whether whether or not a username is available.
   *
   * @param username The username to check.
   *
   * @returns Whether or not the username is available.
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    return this.gateway.get("api/username_available", { user: username });
  }
}
