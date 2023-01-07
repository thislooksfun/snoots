import type { WikiControls } from "./controls";
import type { WikiPageData, WikiSettings } from "./types";

/**
 * Class for manipulating a wiki page
 */
export class WikiPage implements WikiPageData {
  /** Subreddit display name */
  subreddit: string;

  /** Wiki page name */
  page: string;

  /** Markdown formatted wiki page contents */
  contentMD: string;

  /** UNDOCUMENTED */
  mayRevise: boolean;

  /** Reason for most recent revision */
  reason: string | null;

  /** Time of current revision creation in seconds */
  revisionDate: number;

  /** Username of person to make current revision */
  revisionBy: string;

  /** UUID of revision */
  revisionID: string;

  /** HTML formatted wiki page contents */
  contentHTML: string;

  /** @internal */
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
   * @param content The new content of the page in markdown format
   * @param reason A string up to 256 characters long, consisting of printable characters
   * @returns An empty object
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
   * @returns Returns boolean indicating whether the page is now hidden (`true` indicates it is hidden)
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
   * @returns UNDOCUMENTED
   */
  async revertPage(revision: string) {
    return this.controls.revertPage(this.subreddit, this.page, revision);
  }

  /**
   * Generate a listing instance of discussions about the wiki page
   * @returns UNIMPLEMENTED
   */
  getDiscussions() {
    return this.controls.getDiscussions();
  }

  /**
   * Generate a listing instance of recent changes for the wiki page
   *
   * @returns Listing of recent changes made to the wiki page
   */
  getRecentChanges() {
    return this.controls.getRecentChangesForPage(this.subreddit, this.page);
  }

  /**
   * Get the settings for the wiki page
   *
   * @returns An object containing the permission level of the page, whether it is hidden,
   * and an array of editor usernames
   */
  async getSettings() {
    return this.controls.getSettings(this.subreddit, this.page);
  }

  /**
   *
   * @param settings An object with the updated wiki page settings. All member fields must be set
   * @returns An object containing the permission level of the page, whether it is hidden,
   * and an array of editor usernames
   */
  async changeSettings(settings: WikiSettings) {
    return this.controls.changeSettings(this.subreddit, this.page, settings);
  }
}
