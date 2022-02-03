import type { Listing } from "..";
import type { SubredditControls } from "../controls";
import type {
  BanOptions,
  LinkPostOptions,
  TextPostOptions,
} from "../controls/subreddit";
import type {
  Maybe,
  SearchSort,
  SearchSyntax,
  Size,
  SubredditType,
  TimeRange,
} from "../helper/types";
import type { Comment, Post } from ".";
import type { ContentData } from "./content";

import { Content } from "./content";

export interface SubredditData extends ContentData {
  /** Whether or not {@link activeUserCount} is intentionally slightly wrong. */
  accountsActiveIsFuzzed: boolean;

  /**
   * The number of users who interacted with this subreddit in the last 15
   * minutes.
   *
   * If {@link accountsActiveIsFuzzed} is `true` this number will be slightly
   * wrong. This is done to prevent statistical inference attacks against small
   * subreddits.
   */
  activeUserCount: number;

  // TODO: Document or remove SubredditData.advertiserCategory
  // advertiserCategory: Maybe<string>;

  /** Whether or not all posts on this subreddit will be marked as OC. */
  allOriginalContent: boolean;

  // TODO: Document or remove SubredditData.allow*
  // allowChatPostCreation: boolean,
  // allowDiscovery: boolean,
  // allowGalleries: boolean,
  // allowImages: boolean,
  // allowPolls: boolean,
  // allowPredictions: boolean,
  // allowPredictionsTournament: boolean,
  // allowVideogifs: boolean,
  // allowVideos: boolean,

  /** The hex color to display behind the banner. */
  bannerBackgroundColor: string;

  /** The URL of the full-size banner image. */
  bannerBackgroundImage: string;

  /** The URL of the mobile-sized banner image. */
  bannerImg: string;

  /** The size of the banner. */
  bannerSize: Maybe<Size>;

  /** Whether or not users can assign flairs to posts. */
  canAssignLinkFlair: boolean;

  /** Whether or not users can choose their own user flair. */
  canAssignUserFlair: boolean;

  /** How many coins this subreddit has. */
  coins: number;

  /** Whether or not to collapse deleted comments by default. */
  collapseDeletedComments: boolean;

  /** How long comment scores are hidden, in minutes. */
  commentScoreHideMins: number;

  /** The URL of the icon for this subreddit. */
  communityIcon: string;

  // TODO: Document or remove SubredditData.contentReviewed
  // contentReviewed: boolean;

  /**
   * The description of this subreddit.
   *
   * @note Reddit's API calls this `public_description`
   */
  description: string;

  /**
   * The description of this subreddit rendered as HTML, or `undefined` if this
   * subreddit does not have a description.
   *
   * @note Reddit's API calls this `public_description_html`
   */
  descriptionHtml: Maybe<string>;

  // TODO: Document or remove SubredditData.disableContributorRequests
  // disableContributorRequests: boolean;

  /**
   * The name of this subreddit with no prefix (e.g. `funny`).
   *
   * If you need the full name of the subreddit (e.g. `r/funny`), use
   * {@link displayNamePrefixed} instead.
   */
  displayName: string;

  /**
   * The name of the subreddit prefixed with `r/` (or `u/` for user subreddits).
   */
  displayNamePrefixed: string;

  /**
   * The custom emoji size if 'Custom sized emojis' has been configured for this
   * subreddit, or `undefined` if no custom size was set.
   */
  emojisCustomSize: Maybe<Size>;

  /** Whether or not emojis are enabled in this subreddit. */
  emojisEnabled: boolean;

  /**
   * Whether or not this subreddit allows users to enter their own message when
   * submitting a report.
   */
  freeFormReports: boolean;

  // TODO: Document or remove SubredditData.hasMenuWidget
  // hasMenuWidget: boolean;

  /**
   * The URL of the image that will be displayed in place of the Snoo on old
   * reddit, or `undefined` if no such image has been set.
   */
  headerImg: Maybe<string>;

  /** The size of {@link headerImg}, or `undefined` if no image was set. */
  headerSize: Maybe<Size>;

  /**
   * The text to display when hovering over {@link headerImg}, or `undefined` if
   * no such title has been set.
   */
  headerTitle: Maybe<string>;

  /** Whether or not ads are hidden in this subreddit. */
  hideAds: boolean;

  // TODO: Document or remove SubredditData.icon*
  // Are these redundant due to communityIcon, or are they actually different?
  // iconImg: string;
  // iconSize: Maybe<Size>;

  // TODO: Document or remove SubredditData.is*
  // isChatPostFeatureEnabled: boolean,
  // isCrosspostableSubreddit: boolean,
  // isEnrolledInNewModmail: boolean,

  // TODO: Document or remove SubredditData.keyColor
  // keyColor: string;

  // TODO: Document or remove SubredditData.lang
  // lang: string;

  // TODO: Document or remove SubredditData.linkFlair*
  // linkFlairEnabled: boolean;
  // linkFlairPosition: "" | "left" | "right";

  // TODO: Document or remove SubredditData.mobileBannerImage
  // mobileBannerImage: string;

  // TODO: Document or remove SubredditData.notificationLevel
  // notificationLevel: Maybe<string>;

  /** Whether or not the `OC` tag is enabled in this subreddit. */
  originalContentTagEnabled: boolean;

  /** Whether or not this post is marked as 18+/nsfw. */
  over18: boolean;

  // TODO: Document or remove SubredditData.predictionLeaderboardEntryType
  // predictionLeaderboardEntryType: "IN_FEED",

  // TODO: Document or remove SubredditData.primaryColor
  // primaryColor: string;

  /**
   * Whether or not the traffic statistics of this subreddit are shown to
   * non-moderators.
   */
  publicTraffic: boolean;

  /** Whether or not this subreddit has been quarantined. */
  quarantine: boolean;

  // TODO: Verify this.
  /**
   * Whether or not commenting is restricted in this subreddit. This will be
   * `true` if {@link subredditType} is set to `private`.
   */
  restrictCommenting: false;

  /**
   * Whether or not posting is restricted in this subreddit. This will be
   * `true` if {@link subredditType} is set to `restricted` or `private`.
   */
  restrictPosting: true;

  /** Whether or not media thumbnails will be shown in the feed. */
  showMedia: boolean;

  /** Whether or not this subreddit shows media previews in the feed. */
  showMediaPreview: boolean;

  /**
   * The text contents of the old reddit sidebar.
   *
   * @note Reddit's API calls this `description`
   */
  sidebar: string;

  /**
   * The contents of the old reddit sidebar, rendered as HTML.
   *
   * @note Reddit's API calls this `description_html`
   */
  sidebarHtml: string;

  /** Whether or not this subreddit allows tagging posts as spoilers. */
  spoilersEnabled: boolean;

  /** The types of posts that can be submitted to this subreddit. */
  submissionType: "any" | "link" | "self";

  /**
   * The custom text to display in the 'submit link' button, or `undefined` if
   * no custom text has been configured.
   */
  submitLinkLabel: Maybe<string>;

  /** Custom text to show on the old reddit text post form. */
  submitText: string;

  /**
   * The custom submit text rendered as HTML, or `undefined` if no such text was
   * configured.
   */
  submitTextHtml: Maybe<string>;

  /** The custom text to display in the 'submit text post' button. */
  submitTextLabel: string;

  /** This subreddit's privacy level. */
  subredditType: SubredditType;

  /** The number of subscribers this subreddit has. */
  subscribers: number;

  /**
   * The suggested way to sort the comments, or `undefined` if no suggestion has
   * been configured.
   */
  // TODO:
  // suggestedCommentSort: Maybe<Sort>;

  /** The title of this subreddit. */
  title: string;

  /** The relative url of this subreddit. */
  url: string;

  // TODO: Document or remove SubredditData.userCanFlairInSr
  // userCanFlairInSr: boolean;

  // TODO: Document or remove SubredditData.userFlair*
  // userFlairBackgroundColor: Maybe<string>;
  // userFlairCssClass: Maybe<string>;
  // userFlairEnabledInSr: boolean;
  // userFlairPosition: "" | "left" | "right";
  // userFlairRichtext: RichTextFlair[];
  // userFlairTemplateId: Maybe<string>;
  // userFlairText: Maybe<string>;
  // userFlairTextColor: Maybe<"dark" | "light">;
  // userFlairType: string;

  /** Whether or not the authorized user has favorited this subreddit. */
  userHasFavorited: boolean;

  /** Whether or not the authorized user is banned from this subreddit. */
  userIsBanned: boolean;

  /**
   * Whether or not the authorized user has been added as an approved poster.
   */
  userIsContributor: boolean;

  /** Whether or not the authorized user is a moderator of this subreddit. */
  userIsModerator: boolean;

  /** Whether or not the authorized user has been muted on this subreddit. */
  userIsMuted: boolean;

  /** Whether or not the authorized user is subscribed to this subreddit. */
  userIsSubscriber: boolean;

  /** Whether or not the authorized user as opted to show their user flair. */
  userSrFlairEnabled: boolean;

  /**
   * Whether or not the authorized user has allowed this subreddit to display
   * custom CSS.
   */
  userSrThemeEnabled: boolean;

  // TODO: Document or remove SubredditData.whitelistStatus
  // whitelistStatus: string;

  /**
   * Whether or not the authorized user has access to edit this subreddit's
   * wiki.
   */
  wikiEnabled: boolean;

  // TODO: Document or remove SubredditData.wls
  // wls: number;
}

export class Subreddit extends Content implements SubredditData {
  accountsActiveIsFuzzed: boolean;
  activeUserCount: number;
  // advertiserCategory: Maybe<string>;
  allOriginalContent: boolean;
  // allowChatPostCreation: boolean,
  // allowDiscovery: boolean,
  // allowGalleries: boolean,
  // allowImages: boolean,
  // allowPolls: boolean,
  // allowPredictions: boolean,
  // allowPredictionsTournament: boolean,
  // allowVideogifs: boolean,
  // allowVideos: boolean,
  bannerBackgroundColor: string;
  bannerBackgroundImage: string;
  bannerImg: string;
  bannerSize: Maybe<Size>;
  canAssignLinkFlair: boolean;
  canAssignUserFlair: boolean;
  coins: number;
  collapseDeletedComments: boolean;
  commentScoreHideMins: number;
  communityIcon: string;
  // contentReviewed: boolean;
  description: string;
  descriptionHtml: Maybe<string>;
  // disableContributorRequests: boolean;
  displayName: string;
  displayNamePrefixed: string;
  emojisCustomSize: Maybe<Size>;
  emojisEnabled: boolean;
  freeFormReports: boolean;
  // hasMenuWidget: boolean;
  headerImg: Maybe<string>;
  headerSize: Maybe<Size>;
  headerTitle: Maybe<string>;
  hideAds: boolean;
  // iconImg: string;
  // iconSize: Maybe<Size>;
  // isChatPostFeatureEnabled: boolean,
  // isCrosspostableSubreddit: boolean,
  // isEnrolledInNewModmail: boolean,
  // keyColor: string;
  // lang: string;
  // linkFlairEnabled: boolean;
  // linkFlairPosition: "" | "left" | "right";
  // mobileBannerImage: string;
  // notificationLevel: Maybe<string>;
  originalContentTagEnabled: boolean;
  over18: boolean;
  // predictionLeaderboardEntryType: "IN_FEED",
  // primaryColor: string;
  publicTraffic: boolean;
  quarantine: boolean;
  restrictCommenting: false;
  restrictPosting: true;
  showMedia: boolean;
  showMediaPreview: boolean;
  sidebar: string;
  sidebarHtml: string;
  spoilersEnabled: boolean;
  submissionType: "any" | "link" | "self";
  submitLinkLabel: Maybe<string>;
  submitText: string;
  submitTextHtml: Maybe<string>;
  submitTextLabel: string;
  subredditType: SubredditType;
  subscribers: number;
  // suggestedCommentSort: Maybe<Sort>;
  title: string;
  url: string;
  // userCanFlairInSr: boolean;
  // userFlairBackgroundColor: Maybe<string>;
  // userFlairCssClass: Maybe<string>;
  // userFlairEnabledInSr: boolean;
  // userFlairPosition: "" | "left" | "right";
  // userFlairRichtext: RichTextFlair[];
  // userFlairTemplateId: Maybe<string>;
  // userFlairText: Maybe<string>;
  // userFlairTextColor: Maybe<"dark" | "light">;
  // userFlairType: string;
  userHasFavorited: boolean;
  userIsBanned: boolean;
  userIsContributor: boolean;
  userIsModerator: boolean;
  userIsMuted: boolean;
  userIsSubscriber: boolean;
  userSrFlairEnabled: boolean;
  userSrThemeEnabled: boolean;
  // whitelistStatus: string;
  wikiEnabled: boolean;
  // wls: number;

  protected controls: SubredditControls;

  /** @internal */
  constructor(controls: SubredditControls, data: SubredditData) {
    super(data);
    this.controls = controls;

    this.accountsActiveIsFuzzed = data.accountsActiveIsFuzzed;
    this.activeUserCount = data.activeUserCount;
    // this.advertiserCategory = data.advertiserCategory;
    this.allOriginalContent = data.allOriginalContent;
    // this.allowChatPostCreation = data.allowChatPostCreation;
    // this.allowDiscovery = data.allowDiscovery;
    // this.allowGalleries = data.allowGalleries;
    // this.allowImages = data.allowImages;
    // this.allowPolls = data.allowPolls;
    // this.allowPredictions = data.allowPredictions;
    // this.allowPredictionsTournament = data.allowPredictionsTournament;
    // this.allowVideogifs = data.allowVideogifs;
    // this.allowVideos = data.allowVideos;
    this.bannerBackgroundColor = data.bannerBackgroundColor;
    this.bannerBackgroundImage = data.bannerBackgroundImage;
    this.bannerImg = data.bannerImg;
    this.bannerSize = data.bannerSize;
    this.canAssignLinkFlair = data.canAssignLinkFlair;
    this.canAssignUserFlair = data.canAssignUserFlair;
    this.coins = data.coins;
    this.collapseDeletedComments = data.collapseDeletedComments;
    this.commentScoreHideMins = data.commentScoreHideMins;
    this.communityIcon = data.communityIcon;
    // this.contentReviewed = data.contentReviewed;
    this.description = data.description;
    this.descriptionHtml = data.descriptionHtml;
    // this.disableContributorRequests = data.disableContributorRequests;
    this.displayName = data.displayName;
    this.displayNamePrefixed = data.displayNamePrefixed;
    this.emojisCustomSize = data.emojisCustomSize;
    this.emojisEnabled = data.emojisEnabled;
    this.freeFormReports = data.freeFormReports;
    // this.hasMenuWidget = data.hasMenuWidget;
    this.headerImg = data.headerImg;
    this.headerSize = data.headerSize;
    this.headerTitle = data.headerTitle;
    this.hideAds = data.hideAds;
    // this.iconImg = data.iconImg;
    // this.iconSize = data.iconSize;
    // this.isChatPostFeatureEnabled = data.isChatPostFeatureEnabled;
    // this.isCrosspostableSubreddit = data.isCrosspostableSubreddit;
    // this.isEnrolledInNewModmail = data.isEnrolledInNewModmail;
    // this.keyColor = data.keyColor;
    // this.lang = data.lang;
    // this.linkFlairEnabled = data.linkFlairEnabled;
    // this.linkFlairPosition = data.linkFlairPosition;
    // this.mobileBannerImage = data.mobileBannerImage;
    // this.notificationLevel = data.notificationLevel;
    this.originalContentTagEnabled = data.originalContentTagEnabled;
    this.over18 = data.over18;
    // this.predictionLeaderboardEntryType = data.predictionLeaderboardEntryType;
    // this.primaryColor = data.primaryColor;
    this.publicTraffic = data.publicTraffic;
    this.quarantine = data.quarantine;
    this.restrictCommenting = data.restrictCommenting;
    this.restrictPosting = data.restrictPosting;
    this.showMedia = data.showMedia;
    this.showMediaPreview = data.showMediaPreview;
    this.sidebar = data.sidebar;
    this.sidebarHtml = data.sidebarHtml;
    this.spoilersEnabled = data.spoilersEnabled;
    this.submissionType = data.submissionType;
    this.submitLinkLabel = data.submitLinkLabel;
    this.submitText = data.submitText;
    this.submitTextHtml = data.submitTextHtml;
    this.submitTextLabel = data.submitTextLabel;
    this.subredditType = data.subredditType;
    this.subscribers = data.subscribers;
    // this.suggestedCommentSort = data.suggestedCommentSort;
    this.title = data.title;
    this.url = data.url;
    // this.userCanFlairInSr = data.userCanFlairInSr;
    // this.userFlairBackgroundColor = data.userFlairBackgroundColor;
    // this.userFlairCssClass = data.userFlairCssClass;
    // this.userFlairEnabledInSr = data.userFlairEnabledInSr;
    // this.userFlairPosition = data.userFlairPosition;
    // this.userFlairRichtext = data.userFlairRichtext;
    // this.userFlairTemplateId = data.userFlairTemplateId;
    // this.userFlairText = data.userFlairText;
    // this.userFlairTextColor = data.userFlairTextColor;
    // this.userFlairType = data.userFlairType;
    this.userHasFavorited = data.userHasFavorited;
    this.userIsBanned = data.userIsBanned;
    this.userIsContributor = data.userIsContributor;
    this.userIsModerator = data.userIsModerator;
    this.userIsMuted = data.userIsMuted;
    this.userIsSubscriber = data.userIsSubscriber;
    this.userSrFlairEnabled = data.userSrFlairEnabled;
    this.userSrThemeEnabled = data.userSrThemeEnabled;
    // this.whitelistStatus = data.whitelistStatus;
    this.wikiEnabled = data.wikiEnabled;
    // this.wls = data.wls;
  }

  /**
   * Re-fetch this subreddit.
   *
   * Note: This returns a _new object_, it is _not_ mutating.
   *
   * @returns A promise that resolves to the newly fetched subreddit.
   */
  async refetch(): Promise<Subreddit> {
    return this.controls.fetch(this.displayName);
  }

  /**
   * Get the posts in this subreddit, sorted by new.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @returns A listing of posts, with the newest ones first.
   */
  getNewPosts(): Listing<Post> {
    return this.controls.getNewPosts(this.displayName);
  }

  /**
   * Get the posts in this subreddit, sorted by top.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param time The time scale to filter by.
   *
   * @returns A listing of posts, with the top rated ones first.
   */
  getTopPosts(time: TimeRange = "all"): Listing<Post> {
    return this.controls.getTopPosts(this.displayName, time);
  }

  /**
   * Get the posts in this subreddit, sorted by hot.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @returns A listing of posts, with the hottest ones first.
   */
  getHotPosts(): Listing<Post> {
    return this.controls.getHotPosts(this.displayName);
  }

  /**
   * Get the posts in this subreddit, sorted by rising.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @returns A listing of posts, with the rising ones first.
   */
  getRisingPosts(): Listing<Post> {
    return this.controls.getRisingPosts(this.displayName);
  }

  /**
   * Get the posts in this subreddit, sorted by controversial.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param time The time scale to filter by.
   *
   * @returns A listing of posts, with the most controversial ones first.
   */
  getControversialPosts(time: TimeRange = "all"): Listing<Post> {
    return this.controls.getControversialPosts(this.displayName, time);
  }

  /**
   * Get the list of items that have been removed from this subreddit.
   *
   * @returns A listing of items that have been removed.
   */
  getSpam(): Listing<Post | Comment> {
    return this.controls.getSpam(this.displayName);
  }

  /**
   * Get the list of comments that have been removed from this subreddit.
   *
   * @returns A listing of comments that have been removed.
   */
  getSpamComments(): Listing<Comment> {
    return this.controls.getSpamComments(this.displayName);
  }

  /**
   * Get the list of posts that have been removed from this subreddit.
   *
   * @returns A listing of posts that have been removed.
   */
  getSpamPosts(): Listing<Post> {
    return this.controls.getSpamPosts(this.displayName);
  }

  /**
   * Get the list of items that have been edited from this subreddit.
   *
   * @returns A listing of items that have been edited.
   */
  getEdited(): Listing<Post | Comment> {
    return this.controls.getEdited(this.displayName);
  }

  /**
   * Get the list of comments that have been edited from this subreddit.
   *
   * @returns A listing of comments that have been edited.
   */
  getEditedComments(): Listing<Comment> {
    return this.controls.getEditedComments(this.displayName);
  }

  /**
   * Get the list of posts that have been edited from this subreddit.
   *
   * @returns A listing of posts that have been edited.
   */
  getEditedPosts(): Listing<Post> {
    return this.controls.getEditedPosts(this.displayName);
  }

  /**
   * Get the list of items that have been reported from this subreddit.
   *
   * @returns A listing of items that have been reported.
   */
  getReported(): Listing<Post | Comment> {
    return this.controls.getReported(this.displayName);
  }

  /**
   * Get the list of comments that have been reported from this subreddit.
   *
   * @returns A listing of comments that have been reported.
   */
  getReportedComments(): Listing<Comment> {
    return this.controls.getReportedComments(this.displayName);
  }

  /**
   * Get the list of posts that have been reported from this subreddit.
   *
   * @returns A listing of posts that have been reported.
   */
  getReportedPosts(): Listing<Post> {
    return this.controls.getReportedPosts(this.displayName);
  }

  /**
   * Get the list of items that have not been moderated from this subreddit.
   *
   * @returns A listing of items that have not been moderated.
   */
  getUnmoderated(): Listing<Post | Comment> {
    return this.controls.getUnmoderated(this.displayName);
  }

  /**
   * Get the list of comments that have not been moderated from this subreddit.
   *
   * @returns A listing of comments that have not been moderated.
   */
  getUnmoderatedComments(): Listing<Comment> {
    return this.controls.getUnmoderatedComments(this.displayName);
  }

  /**
   * Get the list of posts that have not been moderated from this subreddit.
   *
   * @returns A listing of posts that have not been moderated.
   */
  getUnmoderatedPosts(): Listing<Post> {
    return this.controls.getUnmoderatedPosts(this.displayName);
  }

  /**
   * Get the list of items that are in the modqueue of this subreddit.
   *
   * @returns A listing of items that are in the modqueue.
   */
  getModqueue(): Listing<Post | Comment> {
    return this.controls.getModqueue(this.displayName);
  }

  /**
   * Get the list of comments that are in the modqueue of this subreddit.
   *
   * @returns A listing of comments that are in the modqueue.
   */
  getModqueueComments(): Listing<Comment> {
    return this.controls.getModqueueComments(this.displayName);
  }

  /**
   * Get the list of posts that are in the modqueue of this subreddit.
   *
   * @returns A listing of posts that are in the modqueue.
   */
  getModqueuePosts(): Listing<Post> {
    return this.controls.getModqueuePosts(this.displayName);
  }

  /**
   * Get a random post from this subreddit.
   *
   * @returns A promise that resolves to a random post.
   */
  async getRandomPost(): Promise<Post> {
    return this.controls.getRandomPost(this.displayName);
  }

  /**
   * Search in this subreddit.
   *
   * @param query The search query.
   * @param time The time range to search in.
   * @param sort The way to sort the search results.
   * @param syntax The search syntax to use.
   *
   * @returns A listing of posts.
   */
  search(
    query: string,
    time: TimeRange = "all",
    sort: SearchSort = "relevance",
    syntax: SearchSyntax = "plain"
  ): Listing<Post> {
    return this.controls.search(this.displayName, query, time, sort, syntax);
  }

  /**
   * Get a Listing of all the comments in this subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param sort How to sort the comments.
   *
   * @returns A sorted Listing of comments.
   */
  getSortedComments(sort: "new" = "new"): Listing<Comment> {
    return this.controls.getSortedComments(this.displayName, sort);
  }

  /**
   * Submit a text post to this subreddit.
   *
   * @param title The title of the post.
   * @param body The body of the post.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postText(
    title: string,
    body?: string,
    options: TextPostOptions = {}
  ): Promise<string> {
    return this.controls.postText(this.displayName, title, body, options);
  }

  /**
   * Submit a link post to this subreddit.
   *
   * @param title The title of the post.
   * @param url The url to link to.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postLink(
    title: string,
    url: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.controls.postLink(this.displayName, title, url, options);
  }

  /**
   * Submit a crosspost.
   *
   * @param title The title of the post.
   * @param postID The ID of the post to crosspost.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postCrosspost(
    title: string,
    postID: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.controls.postCrosspost(
      this.displayName,
      title,
      postID,
      options
    );
  }

  /**
   * Accept a moderator invite.
   *
   * @returns A promise that resolves when the invite has been accepted.
   */
  async acceptModeratorInvite(): Promise<void> {
    return this.controls.acceptModeratorInvite(this.displayName);
  }

  /**
   * Add an approved poster.
   *
   * @param name The username of the user to add.
   *
   * @returns A promise that resolves when the contributor has been added.
   */
  async addContributor(name: string): Promise<void> {
    return this.controls.addContributor(this.displayName, name);
  }

  /**
   * Remove an approved poster.
   *
   * @param name The username of the user to remove.
   *
   * @returns A promise that resolves when the contributor has been removed.
   */
  async removeContributor(name: string): Promise<void> {
    return this.controls.removeContributor(this.displayName, name);
  }

  /**
   * Remove yourself (the authorized user) from the list of approved posters.
   *
   * @returns A promise that resolves when you have been sucessfully removed.
   */
  async leaveContributor(): Promise<void> {
    await this.controls.leaveContributor(`t5_${this.id}`);
  }

  /**
   * Add a user to the list of approved wiki editors.
   *
   * @param name The username of the user to add.
   *
   * @returns A promise that resolves when the wiki editor has been added.
   */
  async addWikiContributor(name: string): Promise<void> {
    return this.controls.addWikiContributor(this.displayName, name);
  }

  /**
   * Remove a user from the list of approved wiki editors.
   *
   * @param name The username of the user to remove.
   *
   * @returns A promise that resolves when the wiki editor has been removed.
   */
  async removeWikiContributor(name: string): Promise<void> {
    return this.controls.removeWikiContributor(this.displayName, name);
  }

  /**
   * Ban a user from this subreddit.
   *
   * @param name The username of the user to ban.
   * @param options Any additional options for the ban.
   *
   * @returns A promise that resolves when the user has been banned.
   */
  async banUser(name: string, options: BanOptions = {}): Promise<void> {
    return this.controls.banUser(this.displayName, name, options);
  }

  /**
   * Unban a user from this subreddit.
   *
   * @param name The username of the user to unban.
   *
   * @returns A promise that resolves when the user has been unbanned.
   */
  async unbanUser(name: string): Promise<void> {
    return this.controls.unbanUser(this.displayName, name);
  }
}
