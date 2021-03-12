/** A string-keyed object that can hold anything. */
export type Data = Record<string, any>;
export type RedditObject = { kind: string; data: Data };

export interface _Listing {
  after: string | null;
  before: string | null;
  children: RedditObject[];
  dist: number | null;
  modhash: string | null;
}
