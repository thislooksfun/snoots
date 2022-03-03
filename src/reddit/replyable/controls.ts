import { BaseControls } from "../base-controls";

/** The base controls for all content that you can reply to. */
export abstract class ReplyableControls extends BaseControls {
  /**
   * Block the author of an item.
   *
   * @note Apparently this only works if the item is in modmail or the user's
   * inbox, and if it's not the request silently succeeds anyway.
   *
   * @param id The ID of the item to block the author of.
   *
   * @returns A promise that resolves when the request is complete.
   */
  async blockAuthor(id: string): Promise<void> {
    await this.gateway.post("api/block", { id: this.namespace(id) });
  }

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
    await this.gateway.post("api/report", {
      /* eslint-disable @typescript-eslint/naming-convention */
      reason: "other",
      other_reason: reason,
      thing_id: this.namespace(id),
      /* eslint-enable @typescript-eslint/naming-convention */
    });
  }

  /** @internal */
  async replyImpl<T>(id: string, text: string): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const body = { text, thing_id: this.namespace(id) };
    return await this.gateway.post("api/comment", body);
  }
}
