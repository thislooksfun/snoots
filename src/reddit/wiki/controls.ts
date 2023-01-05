import type { Client } from "../../client";
import type { RedditObject } from "../types";
import type {
  wikiPermissionLevel,
  WikiSettings,
  WikiSettingsAndEditors,
} from "./types";

import { BaseControls } from "../base-controls";
import { fakeListingAfter } from "../listing/util";
import { WikiRevisionsListing } from "./listing";
import { WikiPage } from "./object";

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
   * @param subreddit The subreddit on which the wiki page exists
   * @param page The name of an existing wiki page
   * @param username the name of an existing user
   * @returns Does not return anything
   */
  async addEditor(subreddit: string, page: string, username: string) {
    return this.allowEditor("add", page, subreddit, username);
  }

  /**
   * Remove a user as an editor on a wiki page
   *
   * @param subreddit The subreddit on which the wiki page exists
   * @param page The name of an existing wiki page
   * @param username the name of an existing user
   * @returns Does not return anything
   */
  async removeEditor(subreddit: string, page: string, username: string) {
    return this.allowEditor("del", page, subreddit, username);
  }

  /**
   * Edit or create a wiki page
   *
   * @param subreddit The subreddit on which the wiki page exists
   * @param page The name of an existing page or new wiki page to create
   * @param content
   * @param previous The starting point revision for this edit
   * @param reason A string up to 256 characters long, consisting of printable characters
   * @returns UNDOCUMENTED
   */
  async editPage(
    subreddit: string,
    page: string,
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
   * @param subreddit The subreddit on which the wiki page exists
   * @param page The name of an existing page or new wiki page to create
   * @param revision a wiki revision ID
   * @returns UNDOCUMENTED
   */
  async toggleVisibility(subreddit: string, page: string, revision: string) {
    return this.gateway.post(`r/${subreddit}/api/wiki/hide`, {
      page,
      revision,
    });
  }

  /**
   * Revert a wiki page to revision
   *
   * @param subreddit The subreddit on which the wiki page exists
   * @param page The name of an existing page or new wiki page to create
   * @param revision a wiki revision ID
   * @returns
   */
  async revertPage(subreddit: string, page: string, revision: string) {
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

  /**
   * Fetch a listing of recent changes made on the wiki for a subreddit
   *
   * @param subreddit The subreddit for whose wiki the list of revisions is
   * sought
   * @returns Listing of recent changes.
   * @note Accepts more parameters, including after, before, count, limit,
   * show, and sr_detail
   */
  getRecentChanges(subreddit: string) {
    const request = { url: `r/${subreddit}/wiki/revisions/`, query: {} };
    const context = { request, client: this.client };
    return new WikiRevisionsListing(fakeListingAfter(""), context);
  }

  /**
   * Fetch a listing of recent changes made on a specified wiki page
   *
   * @param subreddit The subreddit on which exists the wiki page
   * @param page The page for which a listing of recent changes is sought
   * @returns A listing of recent changes for a given wiki page
   * @note Accepts more parameters, including after, before, count, limit,
   * show, and sr_detail
   */
  getRecentChangesForPage(subreddit: string, page: string) {
    const request = { url: `r/${subreddit}/wiki/revisions/${page}`, query: {} };
    const context = { request, client: this.client };
    return new WikiRevisionsListing(fakeListingAfter(""), context);
  }

  /**
   * Transforms response from GET or POST request to
   * `r/${subreddit}/wiki/settings/${page}` into a format that snoots uses
   * @internal
   * @param param0 Response from `r/${subreddit}/wiki/settings/${page}`
   * @returns WikiSettingsAndEditors object
   */
  private buildSettingsObjectFromResponse({
    data: { permlevel, editors, listed },
  }: RedditObject<{
    permlevel: wikiPermissionLevel;
    editors: Array<RedditObject<{ name: string }>>;
    listed: boolean;
  }>): WikiSettingsAndEditors {
    return {
      permlevel,
      listed,
      editors: editors.map(object => object.data.name),
    };
  }

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
    return this.buildSettingsObjectFromResponse(
      await this.gateway.get<
        RedditObject<{
          permlevel: wikiPermissionLevel;
          editors: Array<RedditObject<{ name: string }>>;
          listed: boolean;
        }>
      >(`r/${subreddit}/wiki/settings/${page}`)
    );
  }

  /**
   * Update the permissions and visibility of wiki page
   *
   * @param subreddit The subreddit on which the wiki page exists
   * @param page The name of an existing page
   * @returns
   */
  async changeSettings(
    subreddit: string,
    page: string,
    settings: WikiSettings
  ) {
    return this.buildSettingsObjectFromResponse(
      await this.gateway.post<
        RedditObject<{
          permlevel: wikiPermissionLevel;
          editors: Array<RedditObject<{ name: string }>>;
          listed: boolean;
        }>
      >(`r/${subreddit}/wiki/settings/${page}`, settings)
    );
  }

  /**
   * Fetches the most recent, or revision `v` of a wiki page. Supposedly will
   * compare two version if provided with `v2`, but could not reproduce.
   *
   * @param subreddit The subreddit on which the wiki page exists
   * @param page The name of an existing page
   * @param v Optional, the specific version of the wiki page to be retrieved
   * @param v2 Optional provided `v`, compares the two versions (UNRELIABLE)
   * @returns Wiki page object
   */
  async getPage(subreddit: string, page: string, v?: string, v2?: string) {
    const oAPIArguments: Record<string, string> = {};
    if (v != undefined) oAPIArguments.v = v;
    if (v2 != undefined) oAPIArguments.v2 = v2;

    const results = await this.gateway.get<RedditObject<object>>(
      `r/${subreddit}/wiki/${page}`,
      oAPIArguments
    );

    return this.wikiPageInstanceFromRedditAPI(subreddit, page, results.data);
  }

  /** @internal */
  private wikiPageInstanceFromRedditAPI(
    subreddit: string,
    page: string,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any
  ) {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    return new WikiPage(this, {
      subreddit,
      page,
      contentMD: data.content_md,
      mayRevise: data.may_revise,
      reason: data.reason,
      revisionDate: data.revision_date,
      revisionBy: data.revision_by.data.name,
      revisionID: data.revision_id,
      contentHTML: data.content_html,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }
}
