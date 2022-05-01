import type { Data } from "../../../helper/types";
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
}
