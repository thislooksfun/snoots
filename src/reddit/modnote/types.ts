/** Values that the type property that a moderator note might take */
export type ModeratorNoteType =
  | "NOTE"
  | "APPROVAL"
  | "REMOVAL"
  | "BAN"
  | "MUTE"
  | "INVITE"
  | "SPAM"
  | "CONTENT_CHANGE"
  | "MOD_ACTION";

/** Search types that the API will accept */
export type ModeratorNoteTypeSearch = ModeratorNoteType | "ALL";

/** Values that the label property that a moderator note might take */
export type ModeratorNoteUserNoteLabelType =
  | "SOLID_CONTRIBUTOR"
  | "HELPFUL_USER"
  | "SPAM_WATCH"
  | "SPAM_WARNING"
  | "ABUSE_WARNING"
  | "BOT_BAN"
  | "PERMA_BAN"
  | "BAN"
  | null;

/** Moderator note netails specific to moderator action that created the note */
export interface ModeratorNoteActionData {
  // TO DO: define type for possible values of this property
  /** Enum describing the action that resulted in the note creation, if
   * through moderator action */
  action: string | null;

  /** Prefixed content ID to which the note pertains or null */
  redditId: string | null;

  /** UNKNOWN */
  details: string | null;

  /** UNKNOWN */
  description: unknown | null;
}

/** Moderator note details specific to the note itself */
export interface ModeratorNoteUserNoteData {
  /** A string of maximum length 250 that might be associated with the moderator
   * note */
  note: string | null;

  /** A prefixed ID of content to which the note pertains or null */
  redditId: string | null;

  /** The label associated with this note or null */
  label: ModeratorNoteUserNoteLabelType;
}

/** The attributes specific to ModeratorNote objects */
export interface ModeratorNoteData {
  /** Details where note resulted from moderator action */
  moderatorActionData: ModeratorNoteActionData;

  /** Display name of the subreddit to which the note pertains */
  subreddit: string;

  /** Display name of the user to which the note pertains */
  user: string;

  /** Display name of the user that created, directly or indirectly */
  operator: string;

  /** Prefixed ID of the moderator note */
  id: string;

  /** Details where the note links to content, has a label, or has text */
  userNoteData: ModeratorNoteUserNoteData;

  /** Time of creation (TODO: Figure out if seconds or milliseconds) */
  createdAt: number;

  /** Where the note is one of a list, this field represents its place in
   * said list */
  cursor?: string;

  /** A description of how the note came to exist, either by manual
   * addition or as a result of a moderator action */
  type: ModeratorNoteType;
}
