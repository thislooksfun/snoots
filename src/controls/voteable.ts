import type Client from "../client";

/** The vote types. 1 = upvote, 0 = no vote, -1 = downvote. */
export type Vote = 1 | 0 | -1;

/**
 * This is an internal class that you likely shouldn't interact with directly.
 *
 * @internal
 */
export default abstract class VoteableControls {
  protected client: Client;
  protected type: string;

  constructor(client: Client, type: string) {
    this.client = client;
    this.type = type;
  }

  /**
   * Set whether or not inbox replies are enabled for an item.
   *
   * @param id The id of the item.
   * @param enabled Whether or not replies should be enabled.
   *
   * @returns A promise that resolves when the change has been made.
   */
  protected async inboxReplies(id: string, enabled: boolean): Promise<void> {
    const state = enabled;
    return this.client.post("api/sendreplies", { id: this.name(id), state });
  }

  /**
   * Enable inbox replies for an item.
   *
   * @param id The id of the item.
   *
   * @returns A promise that resolves when replies have been enabled.
   */
  async enableInboxReplies(id: string): Promise<void> {
    return this.inboxReplies(id, true);
  }

  /**
   * Disable inbox replies for an item.
   *
   * @param id The id of the item.
   *
   * @returns A promise that resolves when replies have been disabled.
   */
  async disableInboxReplies(id: string): Promise<void> {
    return this.inboxReplies(id, false);
  }

  // TODO: Implement these as well.
  // async delete(id: string): Promise<void> {}
  // async distinguish(id: string, state: DistinguishStates): Promise<void> {}
  // async edit(updatedText: string): Promise<void> {}
  // async expandReplies(options?: { limit?: number; depth?: number }): Promise<T> {}
  // async gild(): Promise<void> {}
  // async save(): Promise<void> {}
  // async undistinguish(): Promise<void> {}
  // async unsave(): Promise<void> {}

  /**
   * Cast a vote.
   *
   * @param id The ID of the item to vote on.
   * @param vote The vote to cast.
   *
   * @returns A promise that resolves when the vote has been cast.
   */
  protected async vote(id: string, vote: Vote): Promise<void> {
    return this.client.post("api/vote", { id: this.name(id), dir: vote });
  }

  /**
   * Cast an upvote.
   *
   * @param id The ID of the item to upvote.
   *
   * @returns A promise that resolves when the vote has been cast.
   */
  async upvote(id: string): Promise<void> {
    return this.vote(id, 1);
  }

  /**
   * Remove your vote.
   *
   * @param id The ID of the item to unvote.
   *
   * @returns A promise that resolves when the vote has been removed.
   */
  async unvote(id: string): Promise<void> {
    return this.vote(id, 0);
  }

  /**
   * Cast a downvote.
   *
   * @param id The ID of the item to downvote.
   *
   * @returns A promise that resolves when the vote has been cast.
   */
  async downvote(id: string): Promise<void> {
    return this.vote(id, -1);
  }

  /**
   * Convert an id into a full name.
   *
   * @param id The ID of the item.
   *
   * @returns The full name of the item.
   */
  protected name(id: string): string {
    return `${this.type}_${id}`;
  }
}
