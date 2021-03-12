import type { Data, RedditObject, _Listing } from "./types";
import type { RedditMore } from "../listings/listing";
import camelCase from "camelcase";

export function camelCaseKeys<T>(obj: Data): T {
  const out: Data = {};
  for (const key in obj) {
    out[camelCase(key)] = obj[key];
  }
  return out as T;
}

export const emptyRedditListing: _Listing = {
  after: null,
  before: null,
  children: [],
  dist: null,
  modhash: null,
};

export function wrapChildren(children: RedditObject[]): _Listing {
  return {
    after: null,
    before: null,
    children,
    dist: null,
    modhash: null,
  };
}

export function fakeMoreListing(name: string): _Listing {
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

export function group<T>(arr: T[], size: number): T[][] {
  const groups: T[][] = [];
  const count = Math.ceil(arr.length / size);
  for (let i = 0; i < count; ++i) {
    groups.push(arr.slice(i * size, (i + 1) * size));
  }

  return groups;
}
