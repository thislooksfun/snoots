import type Client from "../client";

/** The vote types. 1 = upvote, 0 = no vote, -1 = downvote. */
export type Vote = 1 | 0 | -1;

/** The base controls for all content that you can vote on. */
export default abstract class VoteableControls {
  protected client: Client;
  protected type: string;

  /** @internal */
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
   * Save an item.
   *
   * This will make the item show up at reddit.com/saved.
   *
   * @param id The ID of the item to save.
   *
   * @returns a promise that resolves when the item has been saved.
   */
  async save(id: string): Promise<void> {
    return this.client.post("api/save", { id: this.name(id) });
  }

  /**
   * Unsave an item.
   *
   * This will make the item no longer show up at reddit.com/saved.
   *
   * @param id The ID of the item to unsave.
   *
   * @returns a promise that resolves when the item has been unsaved.
   */
  async unsave(id: string): Promise<void> {
    return this.client.post("api/unsave", { id: this.name(id) });
  }

  /**
   * Edit an item.
   *
   * @param id The ID of the item to edit.
   * @param newText The new text to use.
   *
   * @returns A promise that resolves when the edit is complete.
   */
  async edit(id: string, newText: string): Promise<void> {
    const body = { thing_id: this.name(id), text: newText };
    return this.client.post("api/editusertext", body);
  }

  /**
   * Delete an item.
   *
   * @param id The ID of the item to edit.
   *
   * @returns A promise that resolves when the item has been deleted.
   */
  async delete(id: string): Promise<void> {
    return this.client.post("api/del", { id: this.name(id) });
  }

  /**
   * Give Reddit gold to the author of an item.
   *
   * @param id The ID of the item to gild.
   *
   * @returns A promise that resolves when the item has been gilded.
   */
  async gild(id: string): Promise<void> {
    return this.client.post(`api/v1/gold/gild/${this.name(id)}`, {});
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
