import type { Client } from "../../client";
import type { Data } from "../../helper/types";
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
  ModmailUnreadCount,
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
  ): Promise<Array<ModmailConversation>> {
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

  /**
   * Creates a new modmail conversation for a particular subreddit
   *
   * @param to Can be EITHER a username (pass as "username" or "u/username"),
   * a subreddit (passed as "r/subreddit") or `null`. If `null` is passed,
   * the behavior of is inferred as either: an internal moderator discussion
   * if the authenticated moderator has modmail permissions, OR, a new
   * modmail conversation with the given `subreddit`, started as a normal
   * user
   * @param subject The subject of the new conversation, as a string having
   * no more than 100 characters
   * @param subreddit The subreddit that will host the modmail conversation.
   * Please note, that this is different from the `to` field.
   * @param body The body of the first message in the new conversation in
   * markdown format
   * @param isAuthorHidden Boolean value, whether the username of the author
   * is hidden. Most likely only useful when a username is passed as `to`
   */
  async createNewConversation(
    to: string | undefined,
    subject: string,
    subreddit: string,
    body: string,
    isAuthorHidden: boolean
  ) {
    const queryObject: Data = {
      subject,
      srName: subreddit,
      body,
      isAuthorHidden,
    };
    if (to != undefined) queryObject.to = to;
    const response = await this.gateway.post<{
      conversation: ModmailConversationData;
      messages: Record<string, ModmailConversationMessageData>;
      // user: ModmailConversationUserData;
      modActions: Record<string, ModmailConversationModeratorAction>;
    }>(`api/mod/conversations`, queryObject);
    return new ModmailConversation(this, response.conversation);
  }

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

  /**
   * Unhighlight the modmail conversation
   * @param conversationID ID of the modmail conversation in question
   * @returns
   */
  async unhighlightConversation(conversationID: string) {
    return this.gateway.delete(
      `api/mod/conversations/${conversationID}/highlight`,
      {}
    );
  }

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

  /**
   * Mark conversations as read
   *
   * @param conversationIds A string or array of strings of conversation ids
   * @returns
   */
  async markAsRead(conversationIds: string | string[]) {
    if (conversationIds instanceof Array<string>)
      conversationIds = conversationIds.join(",");
    return this.gateway.post("api/mod/conversations/read", { conversationIds });
  }

  /**
   * Undocumented
   * @returns
   */
  async getSubreddits(): Promise<string[]> {
    const response = await this.gateway.get<{
      subreddits: Record<string, { name: string }>;
    }>("api/mod/conversations/subreddits");
    return Object.values(response.subreddits).map(sub => sub.name);
  }

  /**
   * Mark conversations as unread
   *
   * @param conversationIds A string or array of strings of conversation ids
   * @returns
   */
  async markAsUnread(conversationIds: string | string[]) {
    if (conversationIds instanceof Array<string>)
      conversationIds = conversationIds.join(",");
    return this.gateway.post("api/mod/conversations/unread", {
      conversationIds,
    });
  }

  async getUnreadCount(): Promise<ModmailUnreadCount> {
    const response = await this.gateway.get<Record<string, number>>(
      "api/mod/conversations/unread/count"
    );
    return {
      archived: response.archived,
      appeals: response.appeals,
      highlighted: response.highlighted,
      notifications: response.notifications,
      joinRequests: response.join_requests,
      filtered: response.filtered,
      new: response.new,
      inProgress: response.inprogress,
      mod: response.mod,
    };
  }
}
