export type ModeratorNoteType =
  | "NOTE"
  | "APPROVAL"
  | "REMOVAL"
  | "BAN"
  | "MUTE"
  | "INVITE"
  | "SPAM"
  | "CONTENT_CHANGE"
  | "MOD_ACTION"
  | "ALL";
export type ModeratorNoteTypeSearch = ModeratorNoteType | "ALL";
export type ModeratorNoteUserNoteLabelType =
  | "SOLID_CONTRIBUTOR"
  | "HELPFUL_USER"
  | "SPAM_WATCH"
  | "SPAM_WARNING"
  | "ABUSE_WARNING"
  | null;

export interface ModeratorNoteActionData {
  action: string;
  redditId: string; // Comment or Submission prefixed ID
  details: string;
  description: unknown;
}

export interface ModeratorNoteUserNoteData {
  note: string | null;
  redditId: string; // Comment or Submission prefixed ID
  label: ModeratorNoteUserNoteLabelType;
}

export interface ModeratorNoteData {
  moderatorActionData: ModeratorNoteActionData;
  subreddit: string;
  user: string;
  operator: string;
  id: string;
  userNoteData: ModeratorNoteUserNoteData;
  createdAt: number;
  cursor: string;
  type: ModeratorNoteType;
}
