import type { Data } from "../types";
import type { Query } from "./core";
import * as core from "./core";

const endpoint = "https://www.reddit.com";
export async function get<T>(
  userAgent: string,
  path: string,
  query: Query = {}
): Promise<T> {
  return core.get(endpoint, `${path}.json`, query, userAgent);
}

export async function post<T>(
  userAgent: string,
  path: string,
  form: Data,
  query: Query = {}
): Promise<T> {
  return core.post(endpoint, `${path}.json`, form, query, userAgent);
}

export async function postJson<T>(
  userAgent: string,
  path: string,
  json: Data,
  query: Query = {}
): Promise<T> {
  return core.postJson(endpoint, `${path}.json`, json, query, userAgent);
}
