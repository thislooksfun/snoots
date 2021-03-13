/** A string-keyed object that can hold anything. */
export type Data = Record<string, any>;

/** @internal */
export type RedditObject = { kind: string; data: Data };
