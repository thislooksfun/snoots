import type { Maybe } from "../../helper/types";
import type { Comment } from "../comment/object";
import type { Listing } from "../listing/listing";
import type { LockableData } from "../lockable/object";
import type { LinkPostOptions } from "../subreddit/controls";
import type { PostControls } from "./controls";

import { Lockable } from "../lockable/object";

/** The suggested way to sort the comments of a post. */
export type SuggestedSort =
  | "confidence"
  | "controversial"
  | "live"
  | "new"
  | "old"
  | "qa"
  | "random"
  | "top";

// TODO: Fully document Media
// This looks like it can be split into two interfaces?
// export interface Media {
//   oembed?: {
//     /** The username of the uploader of the source media */
//     author_name?: string;
//     /** URL to the author's profile on the source website */
//     author_url?: string;
//     description?: string;
//     height: number;
//     html: string;
//     /** Name of the source website, e.g. "gfycat", "YouTube" */
//     provider_name: string;
//     /** URL of the source website, e.g. "https://www.youtube.com" */
//     provider_url: string;
//     thumbnail_height: number;
//     thumbnail_url: string;
//     thumbnail_width: number;
//     /** Name of the media on the content site, e.g. YouTube video title */
//     title: string;
//     type: "video" | "rich";
//     version: string;
//     width: number;
//   };
//   reddit_video?: {
//     dash_url: string;
//     duration: number;
//     fallback_url: string;
//     height: number;
//     hls_url: string;
//     is_gif: boolean;
//     scrubber_media_url: string;
//     transcoding_status: string;
//   };
//   type?: string;
// }

// TODO: Fully document MediaEmbed
// export interface MediaEmbed {
//   /** HTML string of the media, usually an iframe */
//   content?: string;
//   height?: number;
//   scrolling?: boolean;
//   width?: number;
// }

// TODO: Fully document SecureMediaEmbed
// export interface SecureMediaEmbed extends MediaEmbed {
//   media_domain_url?: string;
// }

// TODO: Fully document ImagePreviewSource
// interface ImagePreviewSource {
//   url: string;
//   width: number;
//   height: number;
// }

// TODO: Fully document ImagePreview
// interface ImagePreview {
//   source: ImagePreviewSource;
//   resolutions: ImagePreviewSource[];
//   variants: any; // ?
//   id: string;
// }

/** The attributes specific to Post objects. */
export interface PostData extends LockableData {
  /**
   * The text body of the post.
   *
   * @note The Reddit API calls this parameter `selftext`.
   */
  body: string;

  /**
   * The HTML body of the post, or `undefined` if the body is empty.
   *
   * @note The Reddit API calls this parameter `selftextHtml`.
   */
  bodyHtml: Maybe<string>;

  // TODO: Document or remove PostData.clicked
  // How is this different from `visited`?
  // clicked: boolean;

  /** A Listing of comments on this post. */
  comments: Listing<Comment>;

  // TODO: Document or remove PostData.contentCategories
  // /** Categories for original content, e.g. "comics", "drawing_and_painting" */
  // contentCategories: Maybe<string[]>;

  /** Whether or not this post is in contest mode. */
  contestMode: boolean;

  /** The domain of the link for this post. */
  domain: string;

  /** Whether or not this post is hidden. */
  hidden: boolean;

  /** Whether or not the score of this post is hidden. */
  hideScore: boolean;

  /** Whether or not you are allowed to crosspost this post. */
  isCrosspostable: boolean;

  /** Whether or not this is a meta post. */
  isMeta: boolean;

  /** Whether or not this post is marked as OC. */
  isOriginalContent: boolean;

  /** Whether the domain is reddit-controlled (true) or 3rd party (false). */
  isRedditMediaDomain: boolean;

  /** Whether or not robots are allowed to index this post. */
  isRobotIndexable: boolean;

  /** Whether or not this is a self (text) post. */
  isSelf: boolean;

  /** Whether or not this is a video post. */
  isVideo: boolean;

  // TODO: Document or remove PostData.linkFlair*
  // linkFlairBackgroundColor: string;
  // linkFlairCssClass: Maybe<string>;
  // linkFlairRichtext: RichTextFlair[];
  // linkFlairTemplateId: Maybe<string>;
  // linkFlairText: Maybe<string>;
  // linkFlairTextColor: "dark" | "light";
  // linkFlairType: "text" | "richtext";

  // TODO: Document or remove PostData.media*
  // media: Maybe<Media>;     // seems to always be undefined
  // mediaEmbed: MediaEmbed;  // seems to always be {}
  // mediaMetadata?: unknown[];
  // mediaOnly: boolean;

  /** The number of comments on this post. */
  numComments: number;

  /** The number of times this has been crossposted. */
  numCrossposts: number;

  /** Whether or not this post is marked as 18+/nsfw. */
  over18: boolean;

  // TODO: Document or remove PostData.parentWhitelistStatus
  // parentWhitelistStatus: string;

  /** Whether or not this post has been pinned. */
  pinned: boolean;

  // TODO: Document or remove PostData.postHint
  // postHint?: string;
  // TODO: Document or remove PostData.preview
  // preview?: { enabled: boolean; images: ImagePreview[] };
  // TODO: Document or remove PostData.previousVisits
  // previousVisits?: number[];
  // TODO: Document or remove PostData.pwls
  // pwls: number; // known values: 6 (is this the same as `wls`?)
  // TODO: Document or remove PostData.quarantine
  // quarantine: boolean;

  // TODO: Document or remove PostData.removedByCategory
  // This should maybe be moved to Voteable?
  // removedByCategory: Maybe<string>;

  // TODO: Document or remove PostData.secureMedia*
  // /** Same content as {@link media}, except HTTPS */
  // secureMedia: Maybe<Media>;
  // secureMediaEmbed: SecureMediaEmbed;

  /** Whether or not this post was marked as being a spoiler. */
  spoiler: boolean;

  /** The number of subscribers the subreddit this was posted to has. */
  subredditSubscribers: number;

  /**
   * The suggested way to sort the comments of this post, or undefined if no
   * such suggestion has been given.
   */
  suggestedSort: Maybe<SuggestedSort>;

  /**
   * The redditmedia URL for the thumbnail of the post.
   * Not to be confused with preview media, thumbnails are usually 140px wide.
   * Self-posts and NSFW posts do not have thumbnails and return their
   * respective type instead of an URL.
   */
  thumbnail: "self" | "nsfw" | string;

  /**
   * Height of the thumbnail image in pixels. `undefined` for self-posts and
   * NSFW posts.
   */
  thumbnailHeight?: number;

  /**
   * Width of the thumbnail image in pixels. `undefined` for
   * self-posts and NSFW posts.
   */
  thumbnailWidth?: number;

  /** The title of this post. */
  title: string;

  /**
   * The ratio of upvotes to downvotes on this post.
   *
   * This will be in the range [0, 1], where 1 is 100% upvoted.
   */
  upvoteRatio: number;

  /**
   * The URL of this post.
   *
   * If this is a link post `url` will be that link. Otherwise it will be the
   * fully-qualified URL of this post.
   */
  url: string;

  // TODO: Document or remove PostData.viewCount
  // This seems to always be undefined.
  // viewCount: Maybe<number>;

  // TODO: Document or remove PostData.visited
  // How is this different from `clicked`?
  // visited: boolean;

  // TODO: Document or remove PostData.whitelistStatus
  // whitelistStatus: string; // known values: 'all_ads'

  // TODO: Document or remove PostData.wls
  // wls: number; // known values: 6
}

/** A single post. */
export class Post extends Lockable implements PostData {
  body: string;
  bodyHtml: Maybe<string>;
  // clicked: boolean;
  comments: Listing<Comment>;
  // contentCategories: Maybe<string[]>;
  contestMode: boolean;
  domain: string;
  hidden: boolean;
  hideScore: boolean;
  isCrosspostable: boolean;
  isMeta: boolean;
  isOriginalContent: boolean;
  isRedditMediaDomain: boolean;
  isRobotIndexable: boolean;
  isSelf: boolean;
  isVideo: boolean;
  // linkFlairBackgroundColor: string;
  // linkFlairCssClass: Maybe<string>;
  // linkFlairRichtext: RichTextFlair[];
  // linkFlairTemplateId: Maybe<string>;
  // linkFlairText: Maybe<string>;
  // linkFlairTextColor: "dark" | "light";
  // linkFlairType: "text" | "richtext";
  // media: Maybe<Media>;
  // mediaEmbed: MediaEmbed;
  // mediaOnly: boolean;
  numComments: number;
  numCrossposts: number;
  over18: boolean;
  // parentWhitelistStatus: string;
  pinned: boolean;
  // postHint: string;
  // preview: { enabled: boolean; images: ImagePreview[] };
  // previousVisits: number[];
  // pwls: number;
  // quarantine: boolean;
  // removedByCategory: Maybe<string>;
  // secureMedia: Maybe<Media>;
  // secureMediaEmbed: SecureMediaEmbed;
  spoiler: boolean;
  subredditSubscribers: number;
  suggestedSort: Maybe<SuggestedSort>;
  thumbnail: "self" | "nsfw" | string;
  thumbnailHeight: Maybe<number>;
  thumbnailWidth: Maybe<number>;
  title: string;
  upvoteRatio: number;
  url: string;
  // viewCount: Maybe<number>;
  // visited: boolean;
  // whitelistStatus: string;
  // wls: number;

  protected override controls: PostControls;

  /** @internal */
  constructor(controls: PostControls, data: PostData) {
    super(controls, data);
    this.controls = controls;

    this.body = data.body;
    this.bodyHtml = data.bodyHtml;
    // this.clicked = data.clicked;
    this.comments = data.comments;
    // this.contentCategories = data.contentCategories;
    this.contestMode = data.contestMode;
    this.domain = data.domain;
    this.hidden = data.hidden;
    this.hideScore = data.hideScore;
    this.isCrosspostable = data.isCrosspostable;
    this.isMeta = data.isMeta;
    this.isOriginalContent = data.isOriginalContent;
    this.isRedditMediaDomain = data.isRedditMediaDomain;
    this.isRobotIndexable = data.isRobotIndexable;
    this.isSelf = data.isSelf;
    this.isVideo = data.isVideo;
    // this.linkFlairBackgroundColor = data.linkFlairBackgroundColor;
    // this.linkFlairCssClass = data.linkFlairCssClass;
    // this.linkFlairRichtext = data.linkFlairRichtext;
    // this.linkFlairTemplateId = data.linkFlairTemplateId;
    // this.linkFlairText = data.linkFlairText;
    // this.linkFlairTextColor = data.linkFlairTextColor;
    // this.linkFlairType = data.linkFlairType;
    // this.media = data.media;
    // this.mediaEmbed = data.mediaEmbed;
    // this.mediaOnly = data.mediaOnly;
    this.numComments = data.numComments;
    this.numCrossposts = data.numCrossposts;
    this.over18 = data.over18;
    // this.parentWhitelistStatus = data.parentWhitelistStatus;
    this.pinned = data.pinned;
    // this.previousVisits = data.previousVisits;
    // this.pwls = data.pwls;
    // this.postHint = data.postHint;
    // this.preview = data.preview;
    // this.quarantine = data.quarantine;
    // this.removedByCategory = data.removedByCategory;
    // this.secureMedia = data.secureMedia;
    // this.secureMediaEmbed = data.secureMediaEmbed;
    this.spoiler = data.spoiler;
    this.subredditSubscribers = data.subredditSubscribers;
    this.suggestedSort = data.suggestedSort;
    this.thumbnail = data.thumbnail;
    this.thumbnailHeight = data.thumbnailHeight;
    this.thumbnailWidth = data.thumbnailWidth;
    this.title = data.title;
    this.upvoteRatio = data.upvoteRatio;
    this.url = data.url;
    // this.viewCount = data.viewCount;
    // this.visited = data.visited;
    // this.whitelistStatus = data.whitelistStatus;
    // this.wls = data.wls;
  }

  /**
   * Re-fetch this post.
   *
   * Note: This returns a _new object_, it is _not_ mutating.
   *
   * @returns A promise that resolves to the newly fetched post.
   */
  async refetch(): Promise<Post> {
    return this.controls.fetch(this.id);
  }

  /**
   * Distinguish this post.
   *
   * @returns A promise that resolves when this post has been distinguished.
   */
  async distinguish(): Promise<void> {
    return this.controls.distinguish(this.id);
  }

  /**
   * Undistinguish this post.
   *
   * @returns A promise that resolves when this post has been undistinguished.
   */
  async undistinguish(): Promise<void> {
    return this.controls.undistinguish(this.id);
  }

  /**
   * Crosspost this post.
   *
   * @param subreddit The name of the subreddit to crosspost to.
   * @param title The title of the crosspost.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the newly created post.
   */
  async crosspostTo(
    subreddit: string,
    title: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.controls.crosspostTo(this.id, subreddit, title, options);
  }

  /**
   * Turn contest mode on/off.
   *
   * @param enabled Whether to turn contest mode on or off.
   *
   * @returns A promise that resolves when this post's contest mode has been
   * updated.
   */
  async setContestMode(enabled: boolean): Promise<void> {
    return this.controls.setContestMode(this.id, enabled);
  }

  /**
   * Set the suggested sort for this post.
   *
   * @param sort The new suggested sort. If this is `undefined` the sort will be
   * cleared.
   * @returns A promise that resolves when this post's suggested sort has been
   * updated.
   */
  async setSuggestedSort(sort: Maybe<SuggestedSort>) {
    return this.controls.setSuggestedSort(this.id, sort);
  }

  /**
   * Get the duplicates of this post.
   *
   * This is the mechanism that drives the "View discussions in X other
   * communities" button on Reddit.
   *
   * @returns A promise that resolves to a listing of posts.
   */
  async getDuplicates(): Promise<Listing<Post>> {
    return this.controls.getDuplicates(this.id);
  }

  /**
   * Hide this post, preventing it from appearing on most listings.
   *
   * @returns A promise that resolves when the post has been hidden.
   */
  async hide(): Promise<void> {
    return this.controls.hide(this.id);
  }

  /**
   * Unhide this post, allowing it to appear on most listings.
   *
   * @returns A promise that resolves when the post has been hidden.
   */
  async unhide(): Promise<void> {
    return this.controls.unhide(this.id);
  }

  /**
   * Mark this post as NSFW.
   *
   * @returns A promise that resolves when the post has been marked as NSFW.
   */
  async markNsfw(): Promise<void> {
    return this.controls.markNsfw(this.id);
  }

  /**
   * Mark this post as not NSFW.
   *
   * @returns A promise that resolves when the post has been unmarked.
   */
  async unmarkNsfw(): Promise<void> {
    return this.controls.unmarkNsfw(this.id);
  }

  /**
   * Mark this post is a spoiler.
   *
   * @returns A promise that resolves when the post has been marked as a spoiler.
   */
  async markSpoiler(): Promise<void> {
    return this.controls.markSpoiler(this.id);
  }

  /**
   * Mark this post is not a spoiler.
   *
   * @returns A promise that resolves when the post has been unmarked.
   */
  async unmarkSpoiler(): Promise<void> {
    return this.controls.unmarkSpoiler(this.id);
  }

  /**
   * Sticky this post.
   *
   * @param slot The slot to sticky this post to.
   *
   * @returns A promise that resolves when the post has been stickied.
   */
  async sticky(slot: 1 | 2): Promise<void> {
    return this.controls.sticky(this.id, slot);
  }

  /**
   * Unsticky this post.
   *
   * @returns A promise that resolves when the post has been unstickied.
   */
  async unsticky(): Promise<void> {
    return this.controls.unsticky(this.id);
  }

  // TODO: Implement these.
  // assignFlair(options: { text: string; cssClass: string }): Promise<this>;
  // getLinkFlairTemplates(): Promise<FlairTemplate[]>;
  // markAsRead(): Promise<this>;
  // eslint-disable-next-line comment-length/limit-single-line-comments
  // selectFlair(options: { flair_template_id: string; text?: string; }): Promise<this>;
  // setSuggestedSort(sort: Sort): Promise<this>;
}
