/** Expanded details of modmail conversation OP */
export interface ModmailConversationUserData {
  /** Unknown */
  recentComments: unknown;

  /** Details on the mute status of the user */
  muteStatus: ModmailConversationDetailedDataMuteStatus;

  /** When was the user account created */
  created: string;

  /** Details on the ban status of the user */
  banStatus: ModmailConversationDetailedDataBanStatus;

  /** Is the account suspended by Reddit */
  isSuspended: boolean;

  /** Details on the approved status of the user */
  approveStatus: ModmailConversationDetailedDataApproveStatus;

  /** Is the user presently shadow banned by Reddit */
  isShadowBanned: boolean;

  /** Recent posts, unknown */
  recentPosts: unknown;

  /** Recent modmail conversations */
  recentConvos: Record<
    string,
    ModmailConversationDetailedDataRecentConversation
  >;

  /** ID of the user */
  id: string;
}

/** Programmer friendly annotations for modmail action types */
export enum modmailConversationModeratorActionType {
  /** Action was to mute the user */
  muteUser = 5,

  /** Action was to unmute the user */
  unmuteUser = 6,

  /** Action was to give approved status to user */
  approveUser = 9,
}

/** Details on a single moderator action */
export interface ModmailConversationModeratorAction {
  /** Date the action was taken */
  date: string;

  /** Type of action taken */
  actionTypeId: modmailConversationModeratorActionType;

  /** ID of the action itself */
  id: string;

  /** Details on the person having performed the action */
  author: ModmailConversationDetailedDataModeratorActionUser;
}

/** Details on the ban status of the user */
export interface ModmailConversationDetailedDataBanStatus {
  /** If banned, when does their ban end */
  endDate: unknown;

  /** If banned, what was the reason for their ban */
  reason: string;

  /** Are they presently banned */
  isBanned: boolean;

  /** Are they presently permanently banned */
  isPermanent: boolean;
}

/** Details on the mute status of the user */
export interface ModmailConversationDetailedDataMuteStatus {
  /** How many times has the user been previously muted */
  muteCount: number;

  /** Are they presently muted */
  isMuted: boolean;

  /** If muted, when does their mute end */
  endDate: unknown;

  /** If muted, what was the reason for their mute */
  reason: string;
}

/** Details on the approved status of the user */
export interface ModmailConversationDetailedDataApproveStatus {
  /** Is the user approved */
  isApproved: boolean;
}

/** Details regarding a recent conversation */
export interface ModmailConversationDetailedDataRecentConversation {
  /** Date of the modmail conversation */
  date: string;

  /** Permanent link to the modmail conversation */
  permalink: string;

  /** ID of the modmail conversation */
  id: string;

  /** Subject of the modmail conversation */
  subject: string;
}

/** Details pertaining to the user who performed a moderator action */
export interface ModmailConversationDetailedDataModeratorActionUser {
  /** Name of the user */
  name: string;

  /** Acting in a moderator capacity */
  isMod: boolean;

  /** Acting in an admin capacity */
  isAdmin: boolean;

  /** Was the username hidden when performing the action */
  isHidden: boolean;

  /** ID of the user in Base 10 */
  id: number;

  /** Is the user presently deleted */
  isDeleted: boolean;
}
