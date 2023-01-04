/**
 * @enum
 * Describes who can edit a wiki page
 */
export enum wikiPermissionLevel {
  /** indicates that this subreddit's default wiki settings should get used */
  default = 0,

  /** indicates that only approved wiki contributors on this subreddit should be
   * able to edit this page */
  onlyApproved = 1,

  /** indicates that only mods should be able to view and edit this page */
  onlyModerators = 2,
}

/**
 * Changeable settings for a wiki page
 */
export interface WikiSettings {
  /** Determines who should be allowed to access and edit a page */
  permlevel: wikiPermissionLevel;

  /** Determines whether this wiki page should appear on the public list of
   * pages for this subreddit
   */
  listed: boolean;
}

/** Settings for a wiki page, including a readonly list of editors */
export interface WikiSettingsAndEditors extends WikiSettings {
  editors: Array<string>;
}
