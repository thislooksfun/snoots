import type { ListingParameters } from "../listing/listing";
import type { TimeRange } from "../types";

/** The ways to sort posts in a subreddit. */
export type PostSort = "controversial" | "hot" | "new" | "rising" | "top";

/**
 * Automatically select post listing options based on post sorting
 *
 * @typeParam TSort The way to sort posts in a subreddit
 */
export type PostListingOptions<TSort extends PostSort> =
  TSort extends "controversial"
    ? TimeRangeListingOptions | undefined
    : TSort extends "hot"
    ? HotPostListingOptions | undefined
    : TSort extends "new"
    ? BasePostListingOptions | undefined
    : TSort extends "rising"
    ? BasePostListingOptions | undefined
    : TSort extends "top"
    ? TimeRangeListingOptions | undefined
    : never;

/**
 * Post listing options.
 */
export interface BasePostListingOptions extends ListingParameters {
  /**
   * Expand subreddits
   */
  expandSubreddits?: boolean;
}

/**
 * Options for post listing sorted by "hot".
 */
export interface HotPostListingOptions extends BasePostListingOptions {
  /**
   * A country code to filter by.
   */
  countryCode?: string;
}

/**
 * Options for post listing sorted by "top" or "controversial".
 */
export interface TimeRangeListingOptions extends BasePostListingOptions {
  /**
   * The time range for posts that should be included in the listing
   */
  timeRange?: TimeRange;
}
