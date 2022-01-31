import type { DistinguishStates } from "../controls/comment";
import type CommentControls from "../controls/comment";
import type { Maybe } from "../helper/types";
import type Listing from "../listings/listing";
import type { VoteableData } from "./voteable";

import Voteable from "./voteable";

/** The attributes specific to Comment objects. */
export interface CommentData extends VoteableData {
  /** The plaintext body of the comment. */
  body: string;

  /** The html rendered body of the comment. */
  bodyHtml: string;

  /** Whether or not this comment is collapsed. */
  collapsed: boolean;

  // TODO: Document or remove CommentData.collapsedBecauseCrowdControl
  // This seems to always be undefined.
  // collapsedBecauseCrowdControl: undefined;

  // TODO: Document or remove CommentData.collapsedReason
  // This seems to always be undefined.
  // collapsedReason: undefined;

  // TODO: Document or remove CommentData.commentType
  // This seems to always be undefined.
  // commentType: undefined;

  // TODO: Document or remove CommentData.controversiality
  // This seems to always be 0.
  // controversiality: 0;

  /** Whether or not the author of this comment is also the op of the post. */
  isSubmitter: boolean;

  /**
   * The fully-qualified ID of the post the comment was posted on.
   *
   * @internal
   */
  linkId: string;

  /**
   * The fully-qualified ID of the parent of this comment.
   *
   * @internal
   */
  parentId: string;

  /** The replies to this comment. */
  replies: Listing<Comment>;

  /**
   * Whether or not this comment has its score hidden.
   *
   * Note: if this is true, {@link score} will always be `1`.
   */
  scoreHidden: boolean;
}

/** A single comment. */
export default class Comment extends Voteable implements CommentData {
  bodyHtml: string;
  body: string;
  collapsed: boolean;
  // collapsedReason: undefined;
  // controversiality: number;
  // ignoreReports: boolean;
  isSubmitter: boolean;
  linkId: string;
  parentId: string;
  replies: Listing<Comment>;
  scoreHidden: boolean;

  protected controls: CommentControls;

  /** @internal */
  constructor(controls: CommentControls, data: CommentData) {
    super(controls, data);
    this.controls = controls;

    this.bodyHtml = data.bodyHtml;
    this.body = data.body;
    // this.collapsedReason = data.collapsedReason;
    this.collapsed = data.collapsed;
    // this.controversiality = data.controversiality;
    // this.ignoreReports = data.ignoreReports;
    this.isSubmitter = data.isSubmitter;
    this.linkId = data.linkId;
    this.parentId = data.parentId;
    this.replies = data.replies;
    this.scoreHidden = data.scoreHidden;
  }

  /**
   * Re-fetch this comment.
   *
   * Note: This returns a _new object_, it is _not_ mutating.
   *
   * @returns A promise that resolves to the newly fetched comment.
   */
  async refetch(): Promise<Comment> {
    return this.controls.fetch(this.id);
  }

  /**
   * Get the ID of the parent of this comment.
   *
   * @returns The ID of the parent, or undefined if this is a top-level comment.
   */
  parentCommentId(): Maybe<string> {
    return this.parentId.startsWith("t1_") ? this.parentId.slice(3) : undefined;
  }

  /**
   * Fetch the parent of this comment.
   *
   * @returns A promise that either resolves the the parent of this comment, or
   * undefined if this is a top-level comment.
   */
  async fetchParent(): Promise<Maybe<Comment>> {
    const id = this.parentCommentId();
    if (!id) return undefined;
    return this.controls.fetch(id);
  }

  /**
   * Get the ID of the post the comment was posted on.
   *
   * @returns The ID of the post.
   */
  postId(): string {
    return this.linkId.slice(3);
  }

  // TODO: implement Comment.fetchPost()
  // async fetchPost(): Promise<Post> {}

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
