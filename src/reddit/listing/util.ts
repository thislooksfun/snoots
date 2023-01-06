import type { RedditObject } from "../types";
import type { RedditListing, RedditMore } from "./listing";

/** @internal */
export function emptyRedditListing<TChildren>(): RedditListing<TChildren> {
  return { children: [] };
}

/** @internal */
export function fakeListingAfter<TChildren>(
  after: string
): RedditListing<TChildren> {
  return { after, children: [] };
}

/** @internal */
export function fakeListingBefore<TChildren>(
  before: string
): RedditListing<TChildren> {
  return { before, children: [] };
}

/** @internal */
export function fakeMoreListing(
  name: string
): RedditListing<RedditObject<RedditMore>> {
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
