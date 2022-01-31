import type { UserControls } from "../../controls";
import type { UserData } from "./base";

import { User } from "./base";

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

  /** @internal */
  constructor(controls: UserControls, data: OtherUserData) {
    super(controls, data);

    this.acceptChats = data.acceptChats;
    this.acceptPms = data.acceptPms;
  }
}
