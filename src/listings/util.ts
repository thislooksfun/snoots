import type { RedditListing, RedditMore } from "./listing";

export const emptyRedditListing: RedditListing = { children: [] };

export function fakeListingAfter(after: string): RedditListing {
  return { after, children: [] };
}

export function fakeListingBefore(before: string): RedditListing {
  return { before, children: [] };
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

  return { children: [{ kind: "more", data: more }] };
}
