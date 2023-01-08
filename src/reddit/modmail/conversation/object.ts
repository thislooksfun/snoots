import type { ModmailControls } from "../controls";
import type { ModmailMuteDurationHours, ModmailParticipant } from "../types";
import type { ModmailConversationOwner } from "./types";

/** The attributes specific to `ModmailConversation` objects */
export interface ModmailConversationData {
  /** Unknown */
  isAuto: boolean;

  /** Information on the original sender */
  participant: ModmailParticipant;

  /** Unknown, perhaps an array of objects describing the messages
   * in the conversation */
  objIds: unknown;

  /** Whether the modmail conversation may be replied to. This probably has
   * something to do with whether the original sender is muted or has been
   * banned
   */
  isRepliable: boolean;

  /** Unknown */
  lastUserUpdate: string; // Formatted timestamp

  /** Unknown, perhaps whether it is a mod discussion */
  isInternal: boolean;

  /** Unknown */
  lastModUpdate: unknown; // Probably formatted timestamp

  /** Array of information on users who have sent messages within the
   * conversation. This list contains duplicate entries, one for each message
   */
  authors: Array<ModmailParticipant>; // array

  /** Unknown */
  lastUpdated: string; // Formatted timestamp

  /** Unknown */
  legacyFirstMessageId: string | null;

  /** Unknown. 0 appears to be unreplied to, 1 has some sort of reply? */
  state: number; // Not sure what this state is

  /** Unknown */
  conversationType: string; // 'sr_user' | 'internal'

  /** Unknown */
  lastUnread: string; // Formatted timestamp

  /** Unknown, perhaps describes the subreddit to which the modmail
   * modmail conversation belongs
   */
  owner: ModmailConversationOwner; // object

  /** Subject of the modmail conversation */
  subject: string;

  /** ID of the conversation */
  id: string;

  /** Whether the conversation has been highlighted */
  isHighlighted: boolean;

  /** Number of messages within the modmail conversation */
  numMessages: number;
}

/** A single undetailed modmail conversation */
export class ModmailConversation implements ModmailConversationData {
  /** @inheritDoc */
  isAuto: boolean;

  /** @inheritDoc */
  participant: ModmailParticipant;

  /** @inheritDoc */
  objIds: unknown;

  /** @inheritDoc */
  isRepliable: boolean;

  /** @inheritDoc */
  lastUserUpdate: string;

  /** @inheritDoc */
  isInternal: boolean;

  /** @inheritDoc */
  lastModUpdate: unknown;

  /** @inheritDoc */
  authors: Array<ModmailParticipant>;

  /** @inheritDoc */
  lastUpdated: string;

  /** @inheritDoc */
  legacyFirstMessageId: string | null;

  /** @inheritDoc */
  state: number;

  /** @inheritDoc */
  conversationType: string;

  /** @inheritDoc */
  lastUnread: string;

  /** @inheritDoc */
  owner: ModmailConversationOwner;

  /** @inheritDoc */
  subject: string;

  /** @inheritDoc */
  id: string;

  /** @inheritDoc */
  isHighlighted: boolean;

  /** @inheritDoc */
  numMessages: number;

  /** @internal */
  private readonly controls: ModmailControls;

  /** @internal */
  constructor(controls: ModmailControls, data: ModmailConversationData) {
    this.isAuto = data.isAuto;
    this.participant = data.participant;
    this.objIds = data.objIds;
    this.isRepliable = data.isRepliable;
    this.lastUserUpdate = data.lastUserUpdate;
    this.isInternal = data.isInternal;
    this.authors = data.authors;
    this.lastUpdated = data.lastUpdated;
    this.legacyFirstMessageId = data.legacyFirstMessageId;
    this.state = data.state;
    this.conversationType = data.conversationType;
    this.lastUnread = data.lastUnread;
    this.owner = data.owner;
    this.subject = data.subject;
    this.id = data.id;
    this.isHighlighted = data.isHighlighted;
    this.numMessages = data.numMessages;

    this.controls = controls;
  }

  /**
   * Fetch a detailed view of the modmail conversation
   * @param markRead Mark the modmail conversation as read at the same time
   */
  async getDetailed(markRead: boolean) {
    return this.controls.getConversation(this.id, markRead);
  }

  /**
   * Create a new message in the modmail conversation. This function is NOT
   * mutating, and instead returns a new `ModmailConversation` object
   *
   * @param body Markdown formatted body of the response
   * @param isAuthorHidden Whether the username of the new response should
   * be hidden
   * @param isInternal Whether the new message is an internal moderator note
   * @returns New `ModmailConversation` object
   */
  async reply(body: string, isAuthorHidden: boolean, isInternal: boolean) {
    return this.controls.replyToConversation(
      this.id,
      body,
      isAuthorHidden,
      isInternal
    );
  }

  /** Give approved status to the original sender of the modmail conversation */
  async approveParticipant() {
    return this.controls.approveParticipant(this.id);
  }

  /** Archive the modmail conversation */
  async archive() {
    return this.controls.archiveConversation(this.id);
  }

  /** Remove approved status from original sender of the modmail conversation */
  async disapproveParticipant() {
    return this.controls.disapproveParticipant(this.id);
  }

  /** Highlight the modmail conversation */
  async highlight() {
    return this.controls.highlightConversation(this.id);
  }

  /** Unhighlight the modmail conversation */
  async unhighlight() {
    return this.controls.unhighlightConversation(this.id);
  }

  /**
   * Temporarily mute the original sender of the modmail conversation
   * @param duration Duration for which to mute the participant (in hours)
   */
  async muteParticipant(duration: ModmailMuteDurationHours) {
    return this.controls.muteParticipant(this.id, duration);
  }

  /**
   * Temporarily ban the original sender of the modmail conversation
   * @param duration Duration for which to temporarily ban the
   * participant (in days)
   */
  async tempBanParticipant(duration: number) {
    return this.controls.tempBanParticipant(this.id, duration);
  }

  /** Unarchive the modmail conversation */
  async unarchive() {
    return this.controls.unarchiveConversation(this.id);
  }

  /** Unban the original sender of the modmail conversation */
  async unbanParticipant() {
    return this.controls.unbanParticipant(this.id);
  }

  /** Unmute the original sender of the modmail conversation */
  async unmuteParticipant() {
    return this.controls.unmuteParticipant(this.id);
  }

  /** Mark the conversation as read */
  async markAsRead() {
    return this.controls.markAsRead(this.id);
  }

  /** Mark the conversation as unread */
  async markAsUnread() {
    return this.controls.markAsUnread(this.id);
  }
}
