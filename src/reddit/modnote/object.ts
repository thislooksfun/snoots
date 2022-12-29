import type { ModeratorNoteControls } from "./controls";
import type {
  ModeratorNoteActionData,
  ModeratorNoteData,
  ModeratorNoteType,
  ModeratorNoteUserNoteData,
} from "./types";

/** A single moderator note */
export class ModeratorNote implements ModeratorNoteData {
  moderatorActionData: ModeratorNoteActionData;
  subreddit: string;
  user: string;
  operator: string;
  id: string;
  userNoteData: ModeratorNoteUserNoteData;
  createdAt: number;
  cursor?: string;
  type: ModeratorNoteType;

  protected controls: ModeratorNoteControls;

  /** @internal */
  constructor(controls: ModeratorNoteControls, data: ModeratorNoteData) {
    this.controls = controls;

    this.moderatorActionData = data.moderatorActionData;
    this.subreddit = data.subreddit;
    this.user = data.user;
    this.operator = data.operator;
    this.id = data.id;
    this.userNoteData = data.userNoteData;
    this.createdAt = data.createdAt;
    this.cursor = data.cursor;
    this.type = data.type;
  }

  /** Utility function for fetching the subreddit to which the moderator note pertains */
  getSubreddit() {
    return this.controls.getSubreddit(this);
  }

  /** Utility function for fetching the user that resulted in the creation of the moderator note*/
  getOperator() {
    return this.controls.getOperator(this);
  }

  /** Utility function for fetching the user to which the moderator note pertains */
  getUser() {
    return this.controls.getUser(this);
  }

  /** Utility function for fetching the content to which the note pertains. Returns undefined if the note does not link to content */
  getContent() {
    return this.controls.getContent(this);
  }

  /** Deletes the moderator note in question */
  delete() {
    return this.controls.deleteNote(this.id, this.subreddit, this.user);
  }
}
