import type { Data } from "../helper/types";
import type { RedditObject } from "./types";

import camelCase from "camelcase";

import { Listing } from "./listing/listing";

/**
 * An invalid kind of object
 */
export class InvalidKindError extends Error {
  constructor(expected: string, got: string) {
    super(`Expected '${expected}', got '${got}'`);
  }
}

/**
 * Ensure that a RedditObject is of the correct type.
 *
 * @param kind The expected kind.
 * @param redditObject The RedditObject to check.
 */
export function assertKind(kind: string, redditObject: RedditObject) {
  if (redditObject.kind !== kind)
    throw new InvalidKindError(kind, redditObject.kind);
}

/**
 * Convert a value from a Reddit API response to a snoots data structure.
 *
 * This performs two steps:
 * 1. Replace `null` with `undefined`
 * 2. Convert the key from snake_case to camelCase
 *
 * @param data The data to convert.
 * @returns The converted object.
 */
export function fromRedditData<T>(data: Data): T {
  const out: Data = {};
  for (const key in data) {
    let value: unknown = data[key];
    if (isObject(value)) {
      if (Array.isArray(value)) {
        value = value.map((item: Data) => {
          return isObject(value) ? fromRedditData(item) : value;
        });
      } else if (!isListing(value)) {
        value = fromRedditData(value);
      }
    } else if (value === null) {
      value = undefined;
    }
    out[camelCase(key)] = value;
  }
  return out as T;
}

function isObject(value: unknown): value is Data {
  return typeof value === "object" && value !== null;
}

function isListing<T>(value: unknown): value is Listing<T> {
  return value instanceof Listing;
}
