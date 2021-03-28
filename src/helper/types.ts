/** A string-keyed object that can hold anything. */
export type Data = Record<string, any>;

/** Either a type or a promise that resolves to that type. */
export type Awaitable<T> = T | Promise<T>;

/** A function that either returns a type or a promise of that type. */
export type AwaitableFn<T, R> = (t: T) => Awaitable<R>;

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
