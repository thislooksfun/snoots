import VoteableControls from "../controls/voteable";
import type { ContentData } from "./content";
import Content from "./content";

export interface RichTextFlair {
  /** The string representation of the emoji */
  a?: string;
  /** The type of the flair entry */
  e: "text" | "emoji";
  /** URL of the emoji image */
  u?: string;
  /** The text content of a text flair */
  t?: string;
}

export interface Gildings {
  /** Number of Reddit Silver awarded */
  gid_1: number;
  /** Number of Reddit Gold awarded */
  gid_2: number;
  /** Number of Reddit Platinum awarded */
  gid_3: number;
}

export type SubredditType =
  | "gold_restricted"
  | "archived"
  | "restricted"
  | "employees_only"
  | "gold_only"
  | "private"
  | "user"
  | "public";

export interface VoteableData extends ContentData {
  approvedAtUtc: number | null;
  approvedBy: string | null;
  archived: boolean;
  author: string;
  authorFlairBackgroundColor: string | null;
  authorFlairCssClass: string | null;
  authorFlairRichtext: RichTextFlair[];
  authorFlairTemplateId: string | null;
  authorFlairText: string | null;
  authorFlairTextColor: string | null;
  authorFlairType: "text" | "richtext";
  authorPatreonFlair: boolean;
  authorPremium: boolean;
  bannedAtUtc: number | null;
  bannedBy: string | null;
  canGild: boolean;
  canModPost: boolean;
  distinguished: "admin" | "moderator" | null;
  edited: number | boolean;
  gilded: number;
  gildings: Gildings;
  /** true = upvoted, false = downvoted, null = hasn't voted */
  likes: boolean | null;
  modNote: string;
  modReasonBy: string;
  modReasonTitle: string;
  modReports: string[];
  noFollow: boolean;
  numReports: number;
  permalink: string;
  removalReason: any;
  reportReasons: string[];
  saved: boolean;
  score: number;
  sendReplies: boolean;
  stickied: boolean;
  subreddit: string;
  subredditId: string;
  subredditType: SubredditType;
  userReports: string[];
}

export default abstract class Voteable extends Content implements VoteableData {
  approvedAtUtc: number | null;
  approvedBy: string | null;
  archived: boolean;
  author: string;
  authorFlairBackgroundColor: string | null;
  authorFlairCssClass: string | null;
  authorFlairRichtext: RichTextFlair[];
  authorFlairTemplateId: string | null;
  authorFlairText: string | null;
  authorFlairTextColor: string | null;
  authorFlairType: "text" | "richtext";
  authorPatreonFlair: boolean;
  authorPremium: boolean;
  bannedAtUtc: number | null;
  bannedBy: string | null;
  canGild: boolean;
  canModPost: boolean;
  distinguished: "admin" | "moderator" | null;
  edited: number | boolean;
  gilded: number;
  gildings: Gildings;
  likes: boolean | null;
  modNote: string;
  modReasonBy: string;
  modReasonTitle: string;
  modReports: string[];
  noFollow: boolean;
  numReports: number;
  permalink: string;
  removalReason: any;
  reportReasons: string[];
  saved: boolean;
  score: number;
  sendReplies: boolean;
  stickied: boolean;
  subreddit: string;
  subredditId: string;
  subredditType: SubredditType;
  userReports: string[];

  protected controls: VoteableControls;

  constructor(controls: VoteableControls, data: VoteableData) {
    super(data);
    this.controls = controls;

    this.approvedAtUtc = data.approvedAtUtc;
    this.approvedBy = data.approvedBy;
    this.archived = data.archived;
    this.author = data.author;
    this.authorFlairBackgroundColor = data.authorFlairBackgroundColor;
    this.authorFlairCssClass = data.authorFlairCssClass;
    this.authorFlairRichtext = data.authorFlairRichtext;
    this.authorFlairTemplateId = data.authorFlairTemplateId;
    this.authorFlairText = data.authorFlairText;
    this.authorFlairTextColor = data.authorFlairTextColor;
    this.authorFlairType = data.authorFlairType;
    this.authorPatreonFlair = data.authorPatreonFlair;
    this.authorPremium = data.authorPremium;
    this.bannedAtUtc = data.bannedAtUtc;
    this.bannedBy = data.bannedBy;
    this.canGild = data.canGild;
    this.canModPost = data.canModPost;
    this.distinguished = data.distinguished;
    this.edited = data.edited;
    this.gilded = data.gilded;
    this.gildings = data.gildings;
    this.likes = data.likes;
    this.modNote = data.modNote;
    this.modReasonBy = data.modReasonBy;
    this.modReasonTitle = data.modReasonTitle;
    this.modReports = data.modReports;
    this.noFollow = data.noFollow;
    this.numReports = data.numReports;
    this.permalink = data.permalink;
    this.removalReason = data.removalReason;
    this.reportReasons = data.reportReasons;
    this.saved = data.saved;
    this.score = data.score;
    this.sendReplies = data.sendReplies;
    this.stickied = data.stickied;
    this.subreddit = data.subreddit;
    this.subredditId = data.subredditId;
    this.subredditType = data.subredditType;
    this.userReports = data.userReports;
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
   * Save this item.
   *
   * This will make this item show up at reddit.com/saved.
   *
   * @returns a promise that resolves when this item has been saved.
   */
  async save(): Promise<void> {
    return this.controls.save(this.id);
  }

  /**
   * Unsave this item.
   *
   * This will make this item no longer show up at reddit.com/saved.
   *
   * @returns a promise that resolves when this item has been unsaved.
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
   * Give Reddit gold to the author of this item.
   *
   * @returns A promise that resolves when this item has been gilded.
   */
  async gild(): Promise<void> {
    return this.controls.gild(this.id);
  }
}
