import type { ListingParameters } from "../listing/listing";
import type { TimeRange } from "../types";

/** The ways to sort posts in a subreddit. */
export type PostSort = "controversial" | "hot" | "new" | "rising" | "top";

/**
 * Post listing options.
 */
export interface PostListingOptions extends ListingParameters {
  /**
   * Expand subreddits
   */
  srDetail?: boolean;
}

/**
 * Options for post listing sorted by "hot".
 */
export interface HotPostListingOptions extends PostListingOptions {
  /**
   * A country code to filter by.
   */
  g?: string;
}

/**
 * Options for post listing sorted by "top" or "controversial".
 */
export interface TimeRangeListingOptions extends PostListingOptions {
  /**
   * The time range for posts that should be included in the listing
   */
  t?: TimeRange;
}
