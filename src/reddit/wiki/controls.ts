import type { Client } from "../../client";
import type { WikiSettings, WikiSettingsAndEditors } from "./types";

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
    return this.gateway.post<void>(
      `r/${subreddit}/api/wiki/alloweditor/${act}`,
      {
        page,
        username,
      }
    );
  }

  /**
   * Add a user as an editor on a wiki page
   *
   * @param page The name of an existing wiki page
   * @param subreddit The subreddit on which the wiki page exists
   * @param username the name of an existing user
   * @returns Does not return anything
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
   * @returns Does not return anything
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
   * @returns List of wiki pages on subreddit as array of strings
   */
  async getPages(subreddit: string) {
    const { data } = await this.gateway.get<{
      kind: "wikipagelisting";
      data: Array<string>;
    }>(`r/${subreddit}/wiki/pages`);
    return data;
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
  async getSettings(
    subreddit: string,
    page: string
  ): Promise<WikiSettingsAndEditors> {
    const results = await this.gateway.get<{
      kind: "wikipagesettings";
      data: {
        permlevel: number;
        editors: Array<{
          kind: "t2";
          data: {
            name: string;
          };
        }>;
        listed: boolean;
      };
    }>(`r/${subreddit}/wiki/settings/${page}`);

    return {
      permlevel: results.data.permlevel,
      listed: results.data.listed,
      editors: results.data.editors.map(object => object.data.name),
    };
  }

  /**
   * Update the permissions and visibility of wiki page
   *
   * @param page The name of an existing page or new wiki page to create
   * @param subreddit The subreddit on which the wiki page exists
   * @returns
   */
  async changeSettings(
    subreddit: string,
    page: string,
    settings: WikiSettings
  ) {
    const results = await this.gateway.post<{
      kind: "wikipagesettings";
      data: {
        permlevel: number;
        editors: Array<{
          kind: "t2";
          data: {
            name: string;
          };
        }>;
        listed: boolean;
      };
    }>(`r/${subreddit}/wiki/settings/${page}`, settings);

    return {
      permlevel: results.data.permlevel,
      listed: results.data.listed,
      editors: results.data.editors.map(object => object.data.name),
    };
  }
}
