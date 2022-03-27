import type { ModeratorActionedUserData } from "./base";

import { ModeratorActionedUser } from "./base";

/** The data specific to a moderator. */
export interface ModeratorData extends ModeratorActionedUserData {
  // TODO:
  // authorFlairCssClass: null // TODO
  // authorFlairText: null, // TODO

  /** The permissions the moderator has. */
  // TODO: enumerate values
  modPermissions: string[];
}

/** A moderator. */
export class Moderator extends ModeratorActionedUser implements ModeratorData {
  modPermissions: string[];

  /** @internal */
  constructor(data: ModeratorData) {
    super(data);

    this.modPermissions = data.modPermissions;
  }
}
