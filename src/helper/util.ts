import type { Data } from "./types";
import camelCase from "camelcase";

export function camelCaseKeys<T>(obj: Data): T {
  const out: Data = {};
  for (const key in obj) {
    out[camelCase(key)] = obj[key];
  }
  return out as T;
}
