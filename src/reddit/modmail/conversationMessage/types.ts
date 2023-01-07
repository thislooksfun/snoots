import type { ModmailParticipant } from "../types";

export interface ModmailConversationMessageData {
  body: string;
  author: ModmailParticipant;
  isInternal: boolean;
  date: string;
  bodyMarkdown: string;
  id: string;
  participatingAs: "participant_user" | "moderator";
}
