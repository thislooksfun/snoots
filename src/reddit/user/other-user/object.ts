import type { UserData } from "../base/object";
import type { UserControls } from "./controls";

import { User } from "../base/object";

/** The data for a user other than the authorized user. */
export interface OtherUserData extends UserData {
  /** Whether or not this user accepts chats. */
  acceptChats: boolean;

  /** Whether or not this user accepts private messages. */
  acceptPms: boolean;
}

/** A user other than the authorized user. */
export class OtherUser extends User implements OtherUserData {
  isMe: false = false;

  acceptChats: boolean;
  acceptPms: boolean;

  protected override controls: UserControls;

  /** @internal */
  constructor(controls: UserControls, data: OtherUserData) {
    super(controls, data);
    this.controls = controls;

    this.acceptChats = data.acceptChats;
    this.acceptPms = data.acceptPms;
  }

  /**
   * Re-fetch this user.
   *
   * Note: This returns a _new object_, it is _not_ mutating.
   *
   * @returns A promise that resolves to the newly fetched user.
   */
  async refetch(): Promise<OtherUser> {
    const user = await this.controls.fetch(this.name);
    return user as OtherUser;
  }
}
