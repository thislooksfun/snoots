import type { Client } from "../../client";

import { BaseControls } from "../base-controls";

/**
 * The base controls for interacting with wiki pages
 *
 * @category Controls
 */
export class WikiControls extends BaseControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "");
  }

  /**
   * @internal
   * Allow/deny a username to edit a wiki page
   *
   * @param act The action to take, `del` removes an editor, `add` adds an editor
   * @param page The name of an existing wiki page
   * @param subreddit The subreddit on which the wiki page exists
   * @param username the name of an existing user
   */
  private async allowEditor(
    act: "del" | "add",
    page: string,
    subreddit: string,
    username: string
  ) {
    return this.gateway.post(`r/${subreddit}/api/wiki/alloweditor/${act}`, {
      page,
      username,
    });
  }

  /**
   * Add a user as an editor on a wiki page
   *
   * @param page The name of an existing wiki page
   * @param subreddit The subreddit on which the wiki page exists
   * @param username the name of an existing user
   * @returns UNDOCUMENTED
   */
  async addEditor(page: string, subreddit: string, username: string) {
    return this.allowEditor("add", page, subreddit, username);
  }

  /**
   * Remove a user as an editor on a wiki page
   *
   * @param page The name of an existing wiki page
   * @param subreddit The subreddit on which the wiki page exists
   * @param username the name of an existing user
   * @returns UNDOCUMENTED
   */
  async removeEditor(page: string, subreddit: string, username: string) {
    return this.allowEditor("del", page, subreddit, username);
  }

  /**
   * Edit or create a wiki page
   *
   * @param page The name of an existing page or new wiki page to create
   * @param subreddit The subreddit on which the wiki page exists
   * @param content
   * @param previous The starting point revision for this edit
   * @param reason A string up to 256 characters long, consisting of printable characters
   * @returns UNDOCUMENTED
   */
  async editPage(
    page: string,
    subreddit: string,
    content: string,
    previous: string,
    reason: string
  ) {
    return this.gateway.post(`r/${subreddit}/api/wiki/edit`, {
      content,
      page,
      previous,
      reason,
    });
  }

  /**
   * Toggle the public visibility of a wiki page revision
   *
   * @param page The name of an existing page or new wiki page to create
   * @param subreddit The subreddit on which the wiki page exists
   * @param revision a wiki revision ID
   * @returns
   */
  async toggleVisibility(page: string, subreddit: string, revision: string) {
    return this.gateway.post(`r/${subreddit}/api/wiki/hide`, {
      page,
      revision,
    });
  }

  /**
   * Revert a wiki page to revision
   *
   * @param page The name of an existing page or new wiki page to create
   * @param subreddit The subreddit on which the wiki page exists
   * @param revision a wiki revision ID
   * @returns
   */
  async revertPage(page: string, subreddit: string, revision: string) {
    return this.gateway.post(`r/${subreddit}/api/wiki/revert`, {
      page,
      revision,
    });
  }

  /*
    async getDiscussions(

    ){

    }
    */

  /**
   * Retrieve a list of wiki pages in this subreddit
   *
   * @param subreddit The subreddit from which to fetch a list of wiki pages
   * @returns
   */
  async getPages(subreddit: string) {
    return this.gateway.get(`r/${subreddit}/wiki/pages`);
  }

  /*
    async getRecentChanges(

    ){

    }
    */

  /*
    async getRecentChangesForPage(

    ){

    }
    */

  /**
   * Retrieve the current permission settings for page
   *
   * @param page The name of an existing page or new wiki page to create
   * @param subreddit The subreddit on which the wiki page exists
   * @returns
   */
  async getSettings(subreddit: string, page: string) {
    return this.gateway.get(`r/${subreddit}/wiki/settings/${page}`);
  }

  /**
   * Update the permissions and visibility of wiki page
   *
   * @param page The name of an existing page or new wiki page to create
   * @param subreddit The subreddit on which the wiki page exists
   * @returns
   */
  async changeSettings(subreddit: string, page: string) {
    return this.gateway.post(`r/${subreddit}/wiki/settings/${page}`, {});
  }
}
