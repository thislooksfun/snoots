import type { WikiControls } from "./controls";
import type { WikiPageData, WikiSettings } from "./types";

export class WikiPage implements WikiPageData {
  subreddit: string;
  page: string;
  contentMD: string;
  mayRevise: boolean;
  reason: string;
  revisionDate: number;
  revisionBy: string;
  revisionID: string;
  contentHTML: string;

  protected controls: WikiControls;

  /** @internal */
  constructor(controls: WikiControls, data: WikiPageData) {
    this.controls = controls;

    this.subreddit = data.subreddit;
    this.page = data.page;
    this.contentMD = data.contentMD;
    this.mayRevise = data.mayRevise;
    this.reason = data.reason;
    this.revisionDate = data.revisionDate;
    this.revisionBy = data.revisionBy;
    this.revisionID = data.revisionID;
    this.contentHTML = data.contentHTML;
  }

  /**
   * Add a user as an editor on the wiki page
   *
   * @param username The name of an existing user to add as an editor
   * @returns Does not return anything
   */
  async addEditor(username: string) {
    return this.controls.addEditor(this.subreddit, this.page, username);
  }

  /**
   * Remove a user as an editor on the wiki page
   *
   * @param username The name of an existing user to remove as an editor
   * @returns Does not return anything
   */
  async removeEditor(username: string) {
    return this.controls.removeEditor(this.subreddit, this.page, username);
  }

  /**
   * Edit the contents of the wiki page along with a provided reason
   *
   * @param content The new content of the page (unknown if markdown or HTML)
   * @param reason A string up to 256 characters long, consisting of printable characters
   * @returns UNDOCUMENTED
   */
  async editPage(content: string, reason: string) {
    return this.controls.editPage(
      this.subreddit,
      this.page,
      content,
      this.revisionID,
      reason
    );
  }

  /**
   * Toggle the public visibility of the wiki page
   *
   * @returns UNDOCUMENTED
   */
  async toggleVisibility() {
    return this.controls.toggleVisibility(
      this.subreddit,
      this.page,
      this.revisionID
    );
  }

  /**
   * Revert a wiki page to a previous revision
   *
   * @param revision The revision ID to which the page should be reverted
   * @returns
   */
  async revertPage(revision: string) {
    return this.controls.revertPage(this.subreddit, this.page, revision);
  }

  // Get Discussions (NOT IMPLEMENTED YET)

  // Get recent changes (NOT IMPLEMENTED YET)

  async getSettings() {
    return this.controls.getSettings(this.subreddit, this.page);
  }

  async changeSettings(settings: WikiSettings) {
    return this.controls.changeSettings(this.subreddit, this.page, settings);
  }
}
