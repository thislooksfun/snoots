import type { ModeratorNoteControls } from "./controls";
import type {
  ModeratorNoteActionData,
  ModeratorNoteData,
  ModeratorNoteType,
  ModeratorNoteUserNoteData,
} from "./types";

export class ModeratorNote implements ModeratorNoteData {
  moderatorActionData: ModeratorNoteActionData;
  subreddit: string;
  user: string;
  operator: string;
  id: string;
  userNoteData: ModeratorNoteUserNoteData;
  createdAt: number;
  cursor: string;
  type: ModeratorNoteType;

  protected controls: ModeratorNoteControls;

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

  getSubreddit() {
    return this.controls.getSubreddit(this);
  }
  getOperator() {
    return this.controls.getOperator(this);
  }
  getUser() {
    return this.controls.getUser(this);
  }
  getContent() {
    return this.controls.getContent(this);
  }
  delete() {
    return this.controls.deleteNote(this.id, this.subreddit, this.user);
  }
}
