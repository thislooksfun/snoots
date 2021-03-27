import type { ContentData } from "./content";
import Content from "./content";
import ReplyableControls from "../controls/replyable";

/** The base for all content that you can reply to. */
export default abstract class Replyable extends Content {
  protected controls: ReplyableControls;

  /** @internal */
  constructor(controls: ReplyableControls, data: ContentData) {
    super(data);
    this.controls = controls;
  }

  /**
   * Report this item to the mods.
   *
   * The report will be anonymous if you are not a mod of the subreddit. If you
   * are a mod the report will be tied to your username.
   *
   * @param reason The reason you are reporting this item.
   *
   * @returns A promise that resolves when this item has been reported.
   */
  async report(reason?: string): Promise<void> {
    return this.controls.report(this.id, reason);
  }
}
