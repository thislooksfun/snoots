/** A string-keyed object that can hold anything. */
export type Data = Record<string, any>;

/** The type of subreddit. */
export type SubredditType =
  | "gold_restricted"
  | "archived"
  | "restricted"
  | "employees_only"
  | "gold_only"
  | "private"
  | "user"
  | "public";

/** @internal */
export type RedditObject<T = Data> = { kind: string; data: T };
