import type { VoteableData } from "../voteable/object";
import type { LockableControls } from "./controls";

import { Voteable } from "../voteable/object";

/** The base for all content that can be locked. */
export interface LockableData extends VoteableData {
  /** Whether or not this item is locked. */
  locked: boolean;
}

/** The base for all content that can be locked. */
export abstract class Lockable extends Voteable implements LockableData {
  locked: boolean;

  protected controls: LockableControls;

  /** @internal */
  constructor(controls: LockableControls, data: LockableData) {
    super(controls, data);
    this.controls = controls;

    this.locked = data.locked;
  }

  /**
   * Lock this item, preventing non-moderators from being able to post replies.
   *
   * @returns A promise that resolves when this item has been locked.
   */
  async lock(): Promise<void> {
    await this.controls.lock(this.id);
  }

  /**
   * Unlock this item, allowing non-moderators to post replies.
   *
   * @returns A promise that resolves when this item has been unlocked.
   */
  async unlock(): Promise<void> {
    await this.controls.unlock(this.id);
  }
}
