import type { DistinguishStates } from "../controls/comment";
import type { VoteableData } from "./voteable";
import CommentControls from "../controls/comment";
import Listing from "../listings/listing";
import Voteable from "./voteable";

export interface CommentData extends VoteableData {
  body: string;
  bodyHtml: string;
  collapsedReason: any;
  collapsed: boolean;
  controversiality: number;
  ignoreReports: boolean;
  isSubmitter: boolean;
  linkId: string;
  parentId: string;
  removed: boolean;
  replies: Listing<Comment>;
  scoreHidden: boolean;
  spam: boolean;
}

export default class Comment extends Voteable implements CommentData {
  bodyHtml: string;
  body: string;
  collapsedReason: any;
  collapsed: boolean;
  controversiality: number;
  ignoreReports: boolean;
  isSubmitter: boolean;
  linkId: string;
  parentId: string;
  removed: boolean;
  replies: Listing<Comment>;
  scoreHidden: boolean;
  spam: boolean;

  protected controls: CommentControls;

  constructor(controls: CommentControls, data: CommentData) {
    super(controls, data);
    this.controls = controls;

    this.bodyHtml = data.bodyHtml;
    this.body = data.body;
    this.collapsedReason = data.collapsedReason;
    this.collapsed = data.collapsed;
    this.controversiality = data.controversiality;
    this.ignoreReports = data.ignoreReports;
    this.isSubmitter = data.isSubmitter;
    this.linkId = data.linkId;
    this.parentId = data.parentId;
    this.removed = data.removed;
    this.replies = data.replies;
    this.scoreHidden = data.scoreHidden;
    this.spam = data.spam;
  }

  /**
   * Re-fetch this comment.
   *
   * Note: This returns a _new object_, it is _not_ mutating.
   *
   * @returns The newly fetched comment.
   */
  async refetch(): Promise<Comment> {
    return this.controls.fetch(this.id);
  }

  /**
   * Distinguish this comment.
   *
   * @param state How this comment should be distinguished.
   *
   * @returns A promise that resolves when this comment has been distinguished.
   */
  async distinguish(state: DistinguishStates): Promise<void> {
    return this.controls.distinguish(this.id, state);
  }
}
