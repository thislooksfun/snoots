import type { Data } from "../helper/types";

/** A size, in the form [width, height]. */
export type Size = [number, number];

/** The search sorting. */
export type SearchSort = "relevance" | "hot" | "top" | "new" | "comments";

/** The search syntax. */
export type SearchSyntax = "cloudsearch" | "lucene" | "plain";

/** A time range. */
export type TimeRange = "hour" | "day" | "week" | "month" | "year" | "all";

/** @internal */
export type RedditObject<T = Data> = { kind: string; data: T };
