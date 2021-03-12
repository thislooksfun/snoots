/** A string-keyed object that can hold anything. */
export type Data = Record<string, any>;

/** @internal */
export type RedditObject = { kind: string; data: Data };

/** @internal */
export interface _Listing {
  after: string | null;
  before: string | null;
  children: RedditObject[];
  dist: number | null;
  modhash: string | null;
}
