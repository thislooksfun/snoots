import type { RedditListing, RedditMore } from "./listing";
import type { RedditObject } from "../helper/types";

export const emptyRedditListing: RedditListing = {
  after: null,
  before: null,
  children: [],
  dist: null,
  modhash: null,
};

export function wrapChildren(children: RedditObject[]): RedditListing {
  return { after: null, before: null, children, dist: null, modhash: null };
}

export function fakeListingAfter(after: string): RedditListing {
  return { after, before: null, children: [], dist: null, modhash: null };
}

export function fakeMoreListing(name: string): RedditListing {
  const more: RedditMore = {
    count: 0, // TODO
    name: `${name.slice(0, 2)}__`,
    id: "_",
    parent_id: name,
    depth: 0, // TODO
    children: [],
  };

  return wrapChildren([{ kind: "more", data: more }]);
}
