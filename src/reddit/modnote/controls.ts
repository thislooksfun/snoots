import type { Client } from "../..";
import type { Data } from "../../helper/types";
import type {
  ModeratorNoteData,
  ModeratorNoteType,
  ModeratorNoteUserNoteLabelType,
} from "./types";

import { BaseControls } from "../..";
import { ModeratorNote } from "./object";

const moderatorNoteAPIEndpoint = "api/mod/notes";

/**
 * Various methods to allow you to interact with moderator notes.
 *
 * @category Controls
 */
export class ModeratorNoteControls extends BaseControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "ModNote_");
  }

  /** @internal */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private noteFromRedditData(data: any): ModeratorNote {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    return new ModeratorNote(this, {
      moderatorActionData: {
        action: data.mod_action_data.action,
        redditId: data.mod_action_data.reddit_id,
        details: data.mod_action_data.details,
        description: data.mod_action_data.description,
      },
      subreddit: data.subreddit,
      user: data.user,
      operator: data.operator,
      id: data.id,
      userNoteData: {
        note: data.user_note_data.note,
        redditId: data.user_note_data.reddit_id,
        label: data.user_note_data.label,
      },
      createdAt: data.created_at,
      cursor: data.cursor,
      type: data.type,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }

  /**
   * Deletes a moderator note
   *
   * @param noteId a unique ID for the note to be deleted (should have a ModNote_ prefix)
   * @param subreddit subreddit name (not prefixed)
   * @param user account username (not prefixed)
   */
  async deleteNote(noteId: string, subreddit: string, user: string) {
    return this.gateway.delete(moderatorNoteAPIEndpoint, {
      subreddit,
      user,
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      note_id: noteId,
    });
  }

  /**
   * Retrieve usernotes for a user on a given subreddit filtered by type
   *
   * @param subreddit subreddit name (not prefixed)
   * @param user account username (not prefixed)
   * @param filter To be used for querying specific types of mod notes
   * @param limit The number of mod notes to return in the response payload (default 25, max 100)
   * @param before An encoded string used for pagination with mod notes
   */
  async getNotes(
    subreddit: string,
    user: string,
    filter: ModeratorNoteType = "ALL",
    limit: number = 25,
    before?: string
  ): Promise<Array<ModeratorNote>> {
    if (limit > 100) limit = 100;

    const redditResponse = await this.gateway.get<{
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      mod_notes: Array<ModeratorNoteData>;
    }>(moderatorNoteAPIEndpoint, {
      subreddit,
      user,
      filter,
      limit,
      before,
    });

    return redditResponse.mod_notes.map(data => this.noteFromRedditData(data));
  }

  /**
   * Create a moderator note for a user on a subreddit, optionally linking to content.
   * Returns newly created note
   *
   * @param subreddit Subreddit display name
   * @param user username targetted
   * @param note String of up to 250 characters to be made as a note
   * @param label Optional label to add to the note
   * @param redditId prefixed ID of comment or submission to link note to
   */
  async createNote(
    subreddit: string,
    user: string,
    note: string,
    label?: ModeratorNoteUserNoteLabelType,
    redditId?: string
  ): Promise<ModeratorNote> {
    const payload = { subreddit, user, note } as Data;
    if (label) payload.label = label;
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    if (redditId) payload.reddit_id = redditId;
    const result = await this.gateway.post<{ created: Data }>(
      moderatorNoteAPIEndpoint,
      payload
    );
    return this.noteFromRedditData(result.created);
  }

  /**
   * Fetch the most recent moderator note made for each of a subreddit-username pair. These are returned as
   * a flat array, with the index of each entry matching the index of the corresponding subreddit-username pair
   * supplied to the function
   *
   * @param SubredditUsernamePairs Array of tuples. The first element of the tuple is a subreddit display name,
   * the second element is a corresponding username. For each tuple in the array, the most recent moderator note
   * for that subreddit-username pair will be returned. Duplicate entries result in undefined behaviour.
   * The array of tuples must have a maximum of 500 entries.
   */
  async getRecent(
    subredditUsernamePairs: Array<[string, string]>
  ): Promise<Array<ModeratorNote>> {
    // Reduce down pairs for reddit API format (CSV)
    // eslint-disable-next-line unicorn/no-array-reduce
    const [subreddits, users] = subredditUsernamePairs.reduce(
      (previous, current) => {
        return [previous[0] + "," + current[0], previous[1] + "," + current[1]];
      }
    );

    // Await response from API in order to post-process response
    const results = await this.gateway.get<{
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      mod_notes: Array<ModeratorNoteData>;
    }>("api/mod/notes/recent", { subreddits, users });

    // Transform response into ModeratorNote instances
    return results.mod_notes.map(data => this.noteFromRedditData(data));
  }

  getSubreddit(data: ModeratorNoteData) {
    return this.client.subreddits.fetch(data.subreddit);
  }
  getOperator(data: ModeratorNoteData) {
    return this.client.users.fetch(data.operator);
  }
  getUser(data: ModeratorNoteData) {
    return this.client.users.fetch(data.user);
  }

  getContent(data: ModeratorNoteData) {
    if (!data.userNoteData.redditId) return;
    return data.userNoteData.redditId.startsWith("t1_")
      ? this.client.comments.fetch(data.userNoteData.redditId)
      : this.client.posts.fetch(data.userNoteData.redditId);
  }
}
