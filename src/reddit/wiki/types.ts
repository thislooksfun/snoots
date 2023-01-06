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

/** Changeable settings for a wiki page */
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
  /** Array of usernames of wiki page editors */
  editors: Array<string>;
}

/** The attributes specific to the WikiPage object */
export interface WikiPageData {
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
}

/** The attributes specific to wiki page revision objects */
export interface WikiPageRevisionData {
  /** Username of person to make current revision */
  author: string;

  /** Time of current revision creation in seconds */
  timestamp: number;

  /** Wiki page name */
  page: string;

  /** Is the page hidden from general view */
  hidden: boolean;

  /** Reason for revision */
  reason: string | null;

  /** UUID of revision */
  revisionID: string;
}
