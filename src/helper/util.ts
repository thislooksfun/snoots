import type { Data, RedditObject } from "./types";

import camelCase from "camelcase";

import { InvalidKindError } from "./errors";

export function camelCaseKeys<T>(obj: Data): T {
  const out: Data = {};
  for (const key in obj) {
    out[camelCase(key)] = obj[key];
  }
  return out as T;
}

export function assertKind(kind: string, obj: RedditObject) {
  if (obj.kind !== kind) throw new InvalidKindError(kind, obj.kind);
}
