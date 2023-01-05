import type { RedditObject } from "../types";
import type { RedditListing, RedditMore } from "./listing";

export const emptyRedditListing: RedditListing = { children: [] };

export function fakeListingAfter<T = RedditObject>(
  after: string
): RedditListing<T> {
  return { after, children: [] };
}

export function fakeListingBefore<T = RedditObject>(
  before: string
): RedditListing<T> {
  return { before, children: [] };
}

export function fakeMoreListing(name: string): RedditListing {
  const more: RedditMore = {
    count: 0, // TODO
    name: `${name.slice(0, 2)}__`,
    id: "_",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    parent_id: name,
    depth: 0, // TODO
    children: [],
  };

  return { children: [{ kind: "more", data: more }] };
}
