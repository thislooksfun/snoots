import type { Data, RedditObject } from "./types";

import camelCase from "camelcase";

import { InvalidKindError } from "./errors";

/**
 * Convert a value from a reddit API response to a snoots data structure.
 *
 * This performs two steps:
 * 1. Replace `null` with `undefined`
 * 2. Convert the key from snake_case to camelCase
 */
export function fromRedditData<T>(data: Data): T {
  const out: Data = {};
  for (const key in data) {
    out[camelCase(key)] = data[key] === null ? undefined : data[key];
  }
  return out as T;
}

export function assertKind(kind: string, redditObject: RedditObject) {
  if (redditObject.kind !== kind)
    throw new InvalidKindError(kind, redditObject.kind);
}
