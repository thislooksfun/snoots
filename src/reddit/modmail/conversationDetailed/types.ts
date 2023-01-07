export interface ModmailConversationUserData {
  recentComments: unknown;
  muteStatus: {
    mutCount: number;
    isMuted: boolean;
    endDate: unknown;
    reason: string;
  };
  created: string;
  banStatus: {
    endDate: unknown;
    reason: string;
    isBanned: boolean;
    isPermanent: boolean;
  };
  isSuspended: boolean;
  approveStatus: {
    isApproved: false;
  };
  isShadowBanned: boolean;
  recentPosts: unknown;
  recentConvos: Record<
    string,
    {
      date: string;
      permalink: string;
      id: string;
      subject: string;
    }
  >;
  id: string;
}

export enum modmailConversationModeratorActionType {
  muteUser = 5,
  unmuteUser = 6,
  approveUser = 9,
}

export interface ModmailConversationModeratorAction {
  date: string;
  actionTypeId: modmailConversationModeratorActionType;
  id: string;
  author: {
    name: string;
    isMod: boolean;
    isAdmin: boolean;
    isHidden: boolean;
    id: number;
    isDeleted: boolean;
  };
}
