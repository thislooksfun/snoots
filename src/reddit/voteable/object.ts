import type { Maybe } from "../../helper/types";
import type { Comment } from "../comment/object";
import type { ContentData } from "../content";
import type { SubredditType } from "../subreddit/types";
import type { VoteableControls } from "./controls";

import { Replyable } from "../replyable/object";

/** A rich text flair containing text. */
export interface RichTextFlairText {
  /** The type of the flair entry. */
  e: "text";

  /** The text content of the flair. */
  t: string;
}

/** A rich text flair containing emoji. */
export interface RichTextFlairEmoji {
  /** The type of the flair entry. */
  e: "emoji";

  /** URL of the emoji image. */
  u: string;

  /** The string representation of the emoji. */
  a: string;
}

/** A rich text flair. */
export type RichTextFlair = RichTextFlairText | RichTextFlairEmoji;

/* eslint-disable @typescript-eslint/naming-convention */
/** The Guildings an item has received. */
export interface Gildings {
  /** Number of Reddit Silver awarded */
  gid_1?: number;

  /** Number of Reddit Gold awarded */
  gid_2?: number;

  /** Number of Reddit Platinum awarded */
  gid_3?: number;
}
/* eslint-enable @typescript-eslint/naming-convention */

/** The base for all content that you can vote on. */
export interface VoteableData extends ContentData {
  /** Whether or not this item was approved. */
  approved?: boolean;

  /**
   * The unix timestamp of when this was approved.
   *
   * This can be undefined if the item either hasn't been approved or you don't
   * have permission to know (i.e. you're not a mod on that subreddit).
   */
  approvedAtUtc: Maybe<number>;

  /**
   * The username of the mod who approved this post.
   *
   * This can be undefined if the item either hasn't been approved or you don't
   * have permission to know (i.e. you're not a mod on that subreddit).
   */
  approvedBy: Maybe<string>;

  /** Whether or not this post is archived. */
  archived: boolean;

  /** The username of the user who created this item. */
  author: string;

  // TODO: Document or remove VoteableData.authorFlair*
  // authorFlairBackgroundColor: Maybe<string>;
  // authorFlairCssClass: Maybe<string>;
  // authorFlairRichtext: RichTextFlair[];
  // authorFlairTemplateId: Maybe<string>;
  // authorFlairText: Maybe<string>;
  // authorFlairTextColor: Maybe<string>;
  // authorFlairType: "text" | "richtext";

  /** Whether or not the author has a Patreon flair. */
  authorPatreonFlair: boolean;

  /** Whether or not the author has Reddit Premium. */
  authorPremium: boolean;

  /**
   * The unix timestamp of when this item was banned (removed).
   *
   * This can be undefined if the item either hasn't been banned or you don't
   * have permission to know (i.e. you're not a mod on that subreddit).
   */
  bannedAtUtc: Maybe<number>;

  /**
   * The username of the mod who banned (removed) this item.
   *
   * This can be undefined if the item either hasn't been banned or you don't
   * have permission to know (i.e. you're not a mod on that subreddit).
   */
  bannedBy: Maybe<string>;

  /** The note of why this item was banned (removed). */
  banNote?: string;

  /** Whether or not this you can guild this item. */
  canGild: boolean;

  /** Whether or not you can moderate this item. */
  canModPost: boolean;

  /** The old reports on this item. */
  dismissedUserReports?: string[];

  /** Whether or not this item was distinguished, and by whom. */
  distinguished: Maybe<"admin" | "moderator">;

  /** The unix timestamp when this item was edited, or `false` if it wasn't. */
  edited: number | false;

  /** How many times this item has been guilded. */
  gilded: number;

  /** The guildings that this item has received. */
  gildings: Gildings;

  /** Whether or not future reports of this item will be ignored. */
  ignoreReports: boolean;

  /**
   * Whether and how you voted on this item.
   *
   * | Value        | Meaning                          |
   * |--------------|----------------------------------|
   * | `true`       | You upvoted this item.           |
   * | `false`      | You downvoted this item.         |
   * | `undefined`  | You have not voted on this item. |
   */
  likes: Maybe<boolean>;

  /**
   * A note about why this item was removed that only the moderators can see, or
   * undefined if no note was added or this item hasn't been removed.
   */
  modNote: Maybe<string>;

  /**
   * The username of the mod who added a removal reason to this item, or
   * undefined if no reason was given or this item hasn't been removed.
   */
  modReasonBy: Maybe<string>;

  /**
   * The reason this item was removed, or undefined if no reason was given or
   * this item hasn't been removed.
   */
  modReasonTitle: Maybe<string>;

  /**
   * The current reports on this item that were made by mods.
   *
   * Each entry is of the form `[report, username]`.
   */
  modReports: [string, string][];

  /**
   * The old reports on this item that were made by mods.
   *
   * Each entry is of the form `[report, username]`.
   */
  modReportsDismissed?: [string, string][];

  // TODO: Document or remove VoteableData.noFollow
  // noFollow: boolean;

  /**
   * The number of reports this item has.
   *
   * This *seems* to be calculated as follows:
   * ```
   * max(
   *   modReports.length - modReportsDismissed.length,
   *   userReports.length - userReportsDismissed.length
   * )
   * ```
   *
   * This means that it will be negative if there were reports that have been
   * dismissed.
   */
  numReports: number;

  /** The permalink to this item, relative to reddit.com. */
  permalink: string;

  /** Whether or not this item has been removed. */
  removed: boolean;

  // TODO: Document or remove VoteableData.removalReason
  // removalReason: any;

  /** Whether or not you have saved this item. */
  saved: boolean;

  /** The score that this item has received. */
  score: number;

  /** Whether or not replies to this item will notify the author. */
  sendReplies: boolean;

  /** Whether or not this item has been marked as spam. */
  spam?: boolean;

  /** Whether or not this item has been sticked. */
  stickied: boolean;

  /** The name of the subreddit this item was posted in. */
  subreddit: string;

  /** The type of the subreddit this item was posted in. */
  subredditType: SubredditType;

  /**
   * The current reports on this item that were made by users.
   *
   * Each entry is of the form `[report, count]`.
   */
  userReports: [string, number][];

  /**
   * The old reports on this item that were made by users.
   *
   * Each entry is of the form `[report, count]`.
   */
  userReportsDismissed?: [string, number][];
}

/** The base for all content that you can vote on. */
export abstract class Voteable extends Replyable implements VoteableData {
  approved?: boolean;
  approvedAtUtc: Maybe<number>;
  approvedBy: Maybe<string>;
  archived: boolean;
  author: string;
  // authorFlairBackgroundColor: Maybe<string>;
  // authorFlairCssClass: Maybe<string>;
  // authorFlairRichtext: RichTextFlair[];
  // authorFlairTemplateId: Maybe<string>;
  // authorFlairText: Maybe<string>;
  // authorFlairTextColor: Maybe<string>;
  // authorFlairType: "text" | "richtext";
  authorPatreonFlair: boolean;
  authorPremium: boolean;
  bannedAtUtc: Maybe<number>;
  bannedBy: Maybe<string>;
  banNote?: string;
  canGild: boolean;
  canModPost: boolean;
  dismissedUserReports?: string[];
  distinguished: Maybe<"admin" | "moderator">;
  edited: number | false;
  gilded: number;
  gildings: Gildings;
  ignoreReports: boolean;
  likes: Maybe<boolean>;
  modNote: Maybe<string>;
  modReasonBy: Maybe<string>;
  modReasonTitle: Maybe<string>;
  modReports: [string, string][];
  modReportsDismissed?: [string, string][];
  // noFollow: boolean;
  numReports: number;
  permalink: string;
  removed: boolean;
  // removalReason: any;
  saved: boolean;
  score: number;
  sendReplies: boolean;
  spam?: boolean;
  stickied: boolean;
  subreddit: string;
  subredditType: SubredditType;
  userReports: [string, number][];
  userReportsDismissed?: [string, number][];

  protected controls: VoteableControls;

  /** @internal */
  constructor(controls: VoteableControls, data: VoteableData) {
    super(controls, data);
    this.controls = controls;

    this.approved = data.approved;
    this.approvedAtUtc = data.approvedAtUtc;
    this.approvedBy = data.approvedBy;
    this.archived = data.archived;
    this.author = data.author;
    // this.authorFlairBackgroundColor = data.authorFlairBackgroundColor;
    // this.authorFlairCssClass = data.authorFlairCssClass;
    // this.authorFlairRichtext = data.authorFlairRichtext;
    // this.authorFlairTemplateId = data.authorFlairTemplateId;
    // this.authorFlairText = data.authorFlairText;
    // this.authorFlairTextColor = data.authorFlairTextColor;
    // this.authorFlairType = data.authorFlairType;
    this.authorPatreonFlair = data.authorPatreonFlair;
    this.authorPremium = data.authorPremium;
    this.bannedAtUtc = data.bannedAtUtc;
    this.bannedBy = data.bannedBy;
    this.banNote = data.banNote;
    this.canGild = data.canGild;
    this.canModPost = data.canModPost;
    this.dismissedUserReports = data.dismissedUserReports;
    this.distinguished = data.distinguished;
    this.edited = data.edited;
    this.gilded = data.gilded;
    this.gildings = data.gildings;
    this.ignoreReports = data.ignoreReports;
    this.likes = data.likes;
    this.modNote = data.modNote;
    this.modReasonBy = data.modReasonBy;
    this.modReasonTitle = data.modReasonTitle;
    this.modReports = data.modReports;
    this.modReportsDismissed = data.modReportsDismissed;
    // this.noFollow = data.noFollow;
    this.numReports = data.numReports;
    this.permalink = data.permalink;
    this.removed = data.removed;
    // this.removalReason = data.removalReason;
    this.saved = data.saved;
    this.score = data.score;
    this.sendReplies = data.sendReplies;
    this.spam = data.spam;
    this.stickied = data.stickied;
    this.subreddit = data.subreddit;
    this.subredditType = data.subredditType;
    this.userReports = data.userReports;
    this.userReportsDismissed = data.userReportsDismissed;
  }

  /**
   * Enable inbox replies for this item.
   *
   * @returns A promise that resolves when replies have been enabled.
   */
  async enableInboxReplies(): Promise<void> {
    return this.controls.enableInboxReplies(this.id);
  }

  /**
   * Disable inbox replies for this item.
   *
   * @returns A promise that resolves when replies have been disabled.
   */
  async disableInboxReplies(): Promise<void> {
    return this.controls.disableInboxReplies(this.id);
  }

  /**
   * Cast an upvote.
   *
   * @returns A promise that resolves when the vote has been cast.
   */
  async upvote(): Promise<void> {
    return this.controls.upvote(this.id);
  }

  /**
   * Remove your vote.
   *
   * @returns A promise that resolves when the vote has been removed.
   */
  async unvote(): Promise<void> {
    return this.controls.unvote(this.id);
  }

  /**
   * Cast a downvote.
   *
   * @returns A promise that resolves when the vote has been cast.
   */
  async downvote(): Promise<void> {
    return this.controls.downvote(this.id);
  }

  /**
   * Reply to this item.
   *
   * @param text The text content of the reply to post.
   *
   * @returns A promise that resolves to the comment reply.
   */
  async reply(text: string): Promise<Comment> {
    return this.controls.reply(this.id, text);
  }

  /**
   * Save this item.
   *
   * This will make this item show up at reddit.com/saved.
   *
   * @returns A promise that resolves when this item has been saved.
   */
  async save(): Promise<void> {
    return this.controls.save(this.id);
  }

  /**
   * Unsave this item.
   *
   * This will make this item no longer show up at reddit.com/saved.
   *
   * @returns A promise that resolves when this item has been unsaved.
   */
  async unsave(): Promise<void> {
    return this.controls.unsave(this.id);
  }

  /**
   * Edit this item.
   *
   * @param newText The new text to use.
   *
   * @returns A promise that resolves when the edit is complete.
   */
  async edit(newText: string): Promise<void> {
    return this.controls.edit(this.id, newText);
  }

  /**
   * Delete this item.
   *
   * @returns A promise that resolves when this item has been deleted.
   */
  async delete(): Promise<void> {
    return this.controls.delete(this.id);
  }

  /**
   * Approve this item.
   *
   * @note This requires the authenticated user to be a moderator of the
   * subreddit with the `posts` permission.
   *
   * @returns A promise that resolves when the item has been approved.
   */
  async approve(): Promise<void> {
    return this.controls.approve(this.id);
  }

  /**
   * Remove this item, optionally marking it as spam.
   *
   * @note This requires the authenticated user to be a moderator of the
   * subreddit with the `posts` permission.
   *
   * @param spam Whether or not to mark this item as spam. Defaults to false.
   *
   * @returns A promise that resolves when this item has been removed.
   */
  async remove(spam: boolean = false): Promise<void> {
    return this.controls.remove(this.id, spam);
  }

  /**
   * Ignore any future reports on this item.
   *
   * @note This requires the authenticated user to be a moderator of the
   * subreddit with the `posts` permission.
   *
   * @returns A promise that resolves when the setting has been changed.
   */
  async ignoreFutureReports(): Promise<void> {
    return this.controls.ignoreFutureReports(this.id);
  }

  /**
   * Unignore any future reports on this item.
   *
   * @note This requires the authenticated user to be a moderator of the
   * subreddit with the `posts` permission.
   *
   * @returns A promise that resolves when the setting has been changed.
   */
  async unignoreFutureReports(): Promise<void> {
    return this.controls.unignoreFutureReports(this.id);
  }

  /**
   * Give Reddit gold to the author of this item.
   *
   * @returns A promise that resolves when this item has been gilded.
   */
  async gild(): Promise<void> {
    return this.controls.gild(this.id);
  }
}
