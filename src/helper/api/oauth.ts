import type { Data } from "../types";
import type { BearerAuth, Query } from "./core";
import * as core from "./core";

const endpoint = "https://oauth.reddit.com";

export interface OauthOpts {
  token: string;
  userAgent: string;
}

export async function get<T>(
  opts: OauthOpts,
  path: string,
  query: Query = {}
): Promise<T> {
  const auth: BearerAuth = { bearer: opts.token };
  return core.get(endpoint, path, query, opts.userAgent, auth);
}

export async function post<T>(
  opts: OauthOpts,
  path: string,
  form: Data,
  query: Query = {}
): Promise<T> {
  const auth: BearerAuth = { bearer: opts.token };
  return core.post(endpoint, path, form, query, opts.userAgent, auth);
}

export async function postJson<T>(
  opts: OauthOpts,
  path: string,
  json: Data,
  query: Query = {}
): Promise<T> {
  const auth: BearerAuth = { bearer: opts.token };
  return core.postJson(endpoint, path, json, query, opts.userAgent, auth);
}
