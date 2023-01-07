import type { Client } from "../../client";
import type { ModmailConversationData } from "./conversation/object";
import type {
  ModmailConversationModeratorAction,
  ModmailConversationUserData,
} from "./conversationDetailed/types";
import type { ModmailConversationMessageData } from "./conversationMessage/types";
import type {
  ModmailMuteDurationHours,
  ModmailSort,
  ModmailState,
} from "./types";

import { BaseControls } from "../base-controls";
import { ModmailConversation } from "./conversation/object";
import { ModmailConversationDetailed } from "./conversationDetailed/object";

/**
 * Various methods to allow you to interact with modmail
 *
 * @category Controls
 */
export class ModmailControls extends BaseControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "");
  }

  /**
   * Bulk mark as read modmail conversations by state
   * @param subreddit A subreddit or array of subreddit display names
   * @param filterState Mark only certain conversations as read according to their state.
   * @returns
   * @throws `HTTPError` in all circumstances
   */
  async bulkMarkRead(
    subreddit: string | Array<string>,
    filterState: ModmailState
  ) {
    if (subreddit instanceof Array<string>) subreddit = subreddit.join(",");
    return this.gateway.post<unknown>("api/mod/bulk_read", {
      entity: subreddit,
      state: filterState,
    });
  }

  /**
   * Get undetailed `ModmailConversation` objects
   * @param subreddit A subreddit or array of subreddit display names
   * @param after A modmail conversation ID
   * @param limit the maximum number of modmail conversations as a number between `0` and `100` (defaults to `25`)
   * @param sort The order in which to sort the returned conversations. Either `mod`, `recent`, `user`, or `unread` (defaults to `recent`)
   * @param state Filter the returned modmail conversations by type. Defaults to `all`
   * @returns
   * @throws `HTTPError` if `after` parameter does not correspond to a conversation ID
   */
  async getConversations(
    subreddit: string | Array<string>,
    after?: string,
    limit: number = 25,
    sort: ModmailSort = "recent",
    state: ModmailState = "all"
  ): Promise<unknown> {
    if (subreddit instanceof Array<string>) subreddit = subreddit.join(",");
    if (limit < 0 || limit > 100) limit = Math.min(Math.max(limit, 0), 100);

    const response = await this.gateway.get<{
      conversations: Record<string, ModmailConversationData>;
      messages: Record<string, ModmailConversationMessageData>;
    }>("api/mod/conversations", {
      after,
      entity: subreddit,
      limit,
      sort,
      state,
    });

    return Object.values(response.conversations).map(
      x => new ModmailConversation(this, x)
    );
  }

  /*
    async createNewConversation( ){

    }
    */

  /**
   * Get `ModmailConversationDetailed` for a given conversation ID
   * @param conversationID ID of the modmail conversation in question
   * @param markRead Mark the modmail as read at the same time
   * @returns
   */
  async getConversation(conversationID: string, markRead: boolean) {
    const results = await this.gateway.get<{
      conversation: ModmailConversationData;
      messages: Record<string, ModmailConversationMessageData>;
      user: ModmailConversationUserData;
      modActions: Record<string, ModmailConversationModeratorAction>;
    }>(`api/mod/conversations/${conversationID}`, { markRead });
    return new ModmailConversationDetailed(this, {
      ...results.conversation,
      messages: Object.values(results.messages),
      user: results.user,
      modActions: Object.values(results.modActions),
    } as ModmailConversationDetailed);
  }

  /*
    async replyToConversation(
        conversationID: string,
        isAuthorHidden: boolean,
        isInternal: boolean,
        body: string // markdown
    ){

    }
    */

  /**
   * Give approved status to the original sender of the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async approveParticipant(conversationID: string) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/approve`,
      {}
    );
  }

  /**
   * Archive a modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async archiveConversation(conversationID: string) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/archive`,
      {}
    );
  }

  /**
   * Remove approved status from original sender of the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async disapproveParticipant(conversationID: string) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/disapprove`,
      {}
    );
  }

  /**
   * Highlight the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async highlightConversation(conversationID: string) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/highlight`,
      {}
    );
  }

  /*
    async unhighlightConversation(conversationID: string){
        return this.gateway.delete(`api/mod/conversations/${conversationID}/highlight`, {})
    }
    */

  /**
   * Temporarily mute the original sender of the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @param duration Duration in hours to mute participant of conversation
   * @returns
   */
  async muteParticipant(
    conversationID: string,
    duration: ModmailMuteDurationHours
  ) {
    return this.gateway.post(`api/mod/conversations/${conversationID}/mute`, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      num_hours: duration,
    });
  }

  /**
   *Temporarily ban the original sender of the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @param duration Number between 1 and 999 in days for which to ban participant
   * @returns
   */
  async tempBanParticipant(conversationID: string, duration: number) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/temp_ban`,
      { duration }
    );
  }

  /**
   * Unarchive the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async unarchiveConversation(conversationID: string) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/unarchive`,
      {}
    );
  }

  /**
   * Unban the original sender of the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async unbanParticipant(conversationID: string) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/unban`,
      {}
    );
  }

  /**
   * Unmute the original sender of the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async unmuteParticipant(conversationID: string) {
    return this.gateway.post(
      `api/mod/conversations/${conversationID}/unmute`,
      {}
    );
  }

  /*
    async markAsRead( conversationIDs: string | string[] ){

    }
    */

  /**
   * Undocumented
   * @returns
   */
  async getSubreddits() {
    return this.gateway.get("api/mod/conversations/subreddits");
  }

  /*
    async markAsUnread( conversationIDs: string[] ){

    }
    */

  /*
    async getUnreadCount( ){

    }
    */
}
