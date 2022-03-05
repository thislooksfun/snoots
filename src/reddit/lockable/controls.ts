import { VoteableControls } from "../voteable/controls";

/** The base controls for all content that can be locked. */
export abstract class LockableControls extends VoteableControls {
  /**
   * Lock an item, preventing non-moderators from being able to post replies.
   *
   * @param id The ID of the item to lock.
   *
   * @returns A promise that resolves when the item has been locked.
   */
  async lock(id: string): Promise<void> {
    await this.gateway.post("api/lock", { id: this.namespace(id) });
  }

  /**
   * Unlock an item, allowing non-moderators to post replies.
   *
   * @param id The ID of the item to unlock.
   *
   * @returns A promise that resolves when the item has been unlocked.
   */
  async unlock(id: string): Promise<void> {
    await this.gateway.post("api/unlock", { id: this.namespace(id) });
  }
}
