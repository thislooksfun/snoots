import type { ReplyableControls } from "../controls/replyable";
import type { ContentData } from "./content";

import { Content } from "./content";

/** The base for all content that you can reply to. */
export abstract class Replyable extends Content {
  protected controls: ReplyableControls;

  /** @internal */
  constructor(controls: ReplyableControls, data: ContentData) {
    super(data);
    this.controls = controls;
  }

  /**
   * Block the author of this item.
   *
   * @note Apparently this only works if this item is in modmail or the user's
   * inbox, and if it's not the request silently succeeds anyway.
   *
   * @returns A promise that resolves when the request is complete.
   */
  async blockAuthor(): Promise<void> {
    return this.controls.blockAuthor(this.id);
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
