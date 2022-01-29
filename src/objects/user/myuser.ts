import type { UserControls } from "../../controls";

import { User, UserData } from "./base";

/** The data for the authorized user. */
export interface MyUserData extends UserData {
  /** Whether or not this user can create a new subreddit. */
  canCreateSubreddit: boolean;

  /** Whether or not this user can edit their name. */
  canEditName: boolean;

  /** The number of coins this user has. */
  coins: number;

  /**
   * Whether or not this user is required to change their password for security.
   */
  forcePasswordReset: boolean;

  /**
   * The unix timestamp at which this user's Premium subscription will expire,
   * or `null` if the user does not have Premium.
   */
  goldExpiration: number | null;

  /** Whether or not this user has subscribed via Android. */
  hasAndroidSubscription: boolean;

  /** Whether or not this user has an external social media account linked. */
  hasExternalAccount: boolean;

  /** Whether or not this user has subscribed via the iOS app store. */
  hasIosSubscription: boolean;

  /** Whether or not this user has unread private messages. */
  hasMail: boolean;

  /** Whether or not this user has unread modmail messages. */
  hasModMail: boolean;

  /** Whether or not this user has subscribed via PayPal. */
  hasPaypalSubscription: boolean;

  /** Whether or not this user has subscribed via Stripe. */
  hasStripeSubscription: boolean;

  /** Whether or not this user has a Reddit premium subscription. */
  hasSubscribedToPremium: boolean;

  /** Whether or not this user has visited their profile on the redesign. */
  hasVisitedNewProfile: boolean;

  /** Whether or not this user has opted-in to the beta. */
  inBeta: boolean;

  /** The number of unread messages in this user's inbox. */
  inboxCount: number;

  /** Whether or not this user can receive chat messages. */
  inChat: boolean;

  /** Whether or not this user is using the redesign by default. */
  inRedesignBeta: boolean;

  /** Whether or not this user is a Reddit sponsor. */
  isSponsor: boolean;

  /** Whether or not this user is suspended. */
  isSuspended: boolean;

  // TODO: Document or remove MyUser.linkedIdentities
  // linkedIdentities?: unknown[]; // Seems to always be empty

  /** The number of friends this user has. */
  numFriends: number;

  /** Whether or not this user is over 18. */
  over18: boolean;

  /** Whether or not this user has a password set. */
  passwordSet: boolean;

  /** Whether or not this user wants videos to autoplay. */
  prefAutoplay: boolean;

  // TODO: Document or remove MyUser.prefClickgadget
  // prefClickgadget: number; // Seems to always be 5

  // TODO: Document or remove MyUser.prefGeopopular
  // prefGeopopular: string; // Seems to always be empty string

  /** Whether or not the user wants Reddit displayed in night mode. */
  prefNightmode: boolean;

  /** Whether or not this user wants to hide 18+/nsfw content. */
  prefNoProfanity: boolean;

  // TODO: Document or remove MyUser.prefShowPresence
  // prefShowPresence: boolean;

  /** Whether or not this user wants trending subreddits shown in their feed. */
  prefShowTrending: boolean;

  /** Whether or this user shows a linked Twitter account on their profile. */
  prefShowTwitter: boolean;

  // TODO: Document or remove MyUser.prefTopKarmaSubreddits
  // prefTopKarmaSubreddits: boolean;

  /** Whether or not this user wants videos to autoplay. */
  prefVideoAutoplay: boolean;

  /**
   * Whether or not this user has seen the "give award" tooltip.
   *
   * @note This is only set when using {@link UserControls.fetchMe}, *not* when
   * using {@link UserControls.fetch}.
   */
  seenGiveAwardTooltip?: boolean;

  /**
   * Whether or not this user has seen the layout switch interface.
   *
   * @note This is only set when using {@link UserControls.fetchMe}, *not* when
   * using {@link UserControls.fetch}.
   */
  seenLayoutSwitch?: boolean;

  /**
   * Whether or not this user has seen a popup saying that buying Reddit premium
   * lets you disable (some) ads.
   *
   * @note This is only set when using {@link UserControls.fetchMe}, *not* when
   * using {@link UserControls.fetch}.
   */
  seenPremiumAdblockModal?: boolean;

  /**
   * Whether or not this user has seen a popup about the redesign.
   *
   * @note This is only set when using {@link UserControls.fetchMe}, *not* when
   * using {@link UserControls.fetch}.
   */
  seenRedesignModal?: boolean;

  /**
   * Whether or not this user has seen the first-time user experience (ftux)
   * popup about the subreddit chat feature.
   *
   * @note This is only set when using {@link UserControls.fetchMe}, *not* when
   * using {@link UserControls.fetch}.
   */
  seenSubredditChatFtux?: boolean;

  /**
   * The unix timestamp of when the suspension will exipire, or `null` if this
   * user is not suspended.
   */
  suspensionExpirationUtc: number | null;
}

/** The authorized user. */
export class MyUser extends User implements MyUserData {
  isMe: true = true;

  canCreateSubreddit: boolean;
  canEditName: boolean;
  coins: number;
  forcePasswordReset: boolean;
  goldExpiration: number | null;
  hasAndroidSubscription: boolean;
  hasExternalAccount: boolean;
  hasIosSubscription: boolean;
  hasMail: boolean;
  hasModMail: boolean;
  hasPaypalSubscription: boolean;
  hasStripeSubscription: boolean;
  hasSubscribedToPremium: boolean;
  hasVisitedNewProfile: boolean;
  inBeta: boolean;
  inboxCount: number;
  inChat: boolean;
  inRedesignBeta: boolean;
  isSponsor: boolean;
  isSuspended: boolean;
  numFriends: number;
  over18: boolean;
  passwordSet: boolean;
  prefAutoplay: boolean;
  prefNightmode: boolean;
  prefNoProfanity: boolean;
  prefShowTrending: boolean;
  prefShowTwitter: boolean;
  prefVideoAutoplay: boolean;
  seenGiveAwardTooltip?: boolean;
  seenLayoutSwitch?: boolean;
  seenPremiumAdblockModal?: boolean;
  seenRedesignModal?: boolean;
  seenSubredditChatFtux?: boolean;
  suspensionExpirationUtc: number | null;

  /** @internal */
  constructor(controls: UserControls, data: MyUserData) {
    super(controls, data);

    this.canCreateSubreddit = data.canCreateSubreddit;
    this.canEditName = data.canEditName;
    this.coins = data.coins;
    this.forcePasswordReset = data.forcePasswordReset;
    this.goldExpiration = data.goldExpiration;
    this.hasAndroidSubscription = data.hasAndroidSubscription;
    this.hasExternalAccount = data.hasExternalAccount;
    this.hasIosSubscription = data.hasIosSubscription;
    this.hasMail = data.hasMail;
    this.hasModMail = data.hasModMail;
    this.hasPaypalSubscription = data.hasPaypalSubscription;
    this.hasStripeSubscription = data.hasStripeSubscription;
    this.hasSubscribedToPremium = data.hasSubscribedToPremium;
    this.hasVisitedNewProfile = data.hasVisitedNewProfile;
    this.inBeta = data.inBeta;
    this.inboxCount = data.inboxCount;
    this.inChat = data.inChat;
    this.inRedesignBeta = data.inRedesignBeta;
    this.isSponsor = data.isSponsor;
    this.isSuspended = data.isSuspended;
    this.numFriends = data.numFriends;
    this.over18 = data.over18;
    this.passwordSet = data.passwordSet;
    this.prefAutoplay = data.prefAutoplay;
    this.prefNightmode = data.prefNightmode;
    this.prefNoProfanity = data.prefNoProfanity;
    this.prefShowTrending = data.prefShowTrending;
    this.prefShowTwitter = data.prefShowTwitter;
    this.prefVideoAutoplay = data.prefVideoAutoplay;
    this.seenGiveAwardTooltip = data.seenGiveAwardTooltip;
    this.seenLayoutSwitch = data.seenLayoutSwitch;
    this.seenPremiumAdblockModal = data.seenPremiumAdblockModal;
    this.seenRedesignModal = data.seenRedesignModal;
    this.seenSubredditChatFtux = data.seenSubredditChatFtux;
    this.suspensionExpirationUtc = data.suspensionExpirationUtc;
  }
}
