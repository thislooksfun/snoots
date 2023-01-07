export type ModmailState =
  | "all"
  | "appeals"
  | "notifications"
  | "inbox"
  | "filtered"
  | "inprogress"
  | "mod"
  | "archived"
  | "default"
  | "highlighted"
  | "join_requests"
  | "new";

export type ModmailSort = "recent" | "mod" | "user" | "unread";

/** Durations for which a user may be muted, in hours */
export type ModmailMuteDurationHours = 72 | 168 | 672;

/** Participant data for an associated message */
export interface ModmailParticipant {
  /** Whether the user is a moderator in the modmail conversation */
  isMod: boolean;

  /** Whether the user is an admin in the modmail conversation */
  isAdmin: boolean;

  /** Display name of the user */
  name: string;

  /** Whether the user is the original sender */
  isOp: boolean;

  /** Whether the user is the original sender (duplicate of isOp?) */
  isParticipant: boolean;

  /** Whether the user is an approved user in the subreddit to which
   * this modmail conversation belongs */
  isApproved: boolean;

  /** Whether the username was hidden for this reply */
  isHidden: boolean;

  /** User ID. Probably in base 10 */
  id: number;

  /** Unknown */
  isDeleted: boolean;
}
