/** Possible modmail conversation states against which to filter */
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

/** Possible modmail conversation sortings */
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

/** Interface for returning the quantities of unread modmail conversations
 * by category
 */
export interface ModmailUnreadCount {
  /** Number of unread archived conversations */
  archived: number;

  /** Number of unread ban appeals */
  appeals: number;

  /** Number of unread highlighted conversations */
  highlighted: number;

  /** Number of unread notifications */
  notifications: number;

  /** Number of unread join requests */
  joinRequests: number;

  /** Number of unread filtered conversations */
  filtered: number;

  /** Number of new unread conversations */
  new: number;

  /** Number of in-progress unread conversations */
  inProgress: number;

  /** Number of unread private moderator conversations */
  mod: number;
}
