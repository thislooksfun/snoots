import BaseControls from "./base";

/** The base controls for all content that you can reply to. */
export default abstract class ReplyableControls extends BaseControls {
  /**
   * Report an item to the mods.
   *
   * The report will be anonymous if you are not a mod of the subreddit. If you
   * are a mod the report will be tied to your username.
   *
   * @param id The ID of the item to report.
   * @param reason The reason you are reporting the item.
   *
   * @returns A promise that resolves when the item has been reported.
   */
  async report(id: string, reason?: string): Promise<void> {
    await this.client.post("api/report", {
      reason: "other",
      other_reason: reason,
      thing_id: this.namespace(id),
    });
  }

  /** @internal */
  async replyImpl<T>(id: string, text: string): Promise<T> {
    const body = { text, thing_id: this.namespace(id) };
    return await this.client.post("api/comment", body);
  }
}
