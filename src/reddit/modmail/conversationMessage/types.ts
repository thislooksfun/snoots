import type { ModmailParticipant } from "../types";

/** Data relevant to a message in a modmail conversation */
export interface ModmailConversationMessageData {
  /** Body of the message in HTML format */
  body: string;

  /** Information pertaining to the author of the message */
  author: ModmailParticipant;

  /** Is the message a private note? */
  isInternal: boolean;

  /** Date the message was sent */
  date: string;

  /** Body of the message in Markdown format */
  bodyMarkdown: string;

  /** ID of the message */
  id: string;

  /** Is the message sent by a user or a moderator (?) */
  participatingAs: "participant_user" | "moderator";
}
