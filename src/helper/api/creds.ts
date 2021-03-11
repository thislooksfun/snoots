import type { Data } from "../types";
import type { BasicAuth, Query } from "./core";
import * as core from "./core";

const endpoint = "https://www.reddit.com";

export interface Credentials {
  clientId: string;
  clientSecret: string;
}

export async function get<T>(
  creds: Credentials,
  userAgent: string,
  path: string,
  query: Query = {}
): Promise<T> {
  const auth: BasicAuth = { user: creds.clientId, pass: creds.clientSecret };
  return core.get(endpoint, `${path}.json`, query, userAgent, auth);
}

export async function post<T>(
  creds: Credentials,
  userAgent: string,
  path: string,
  json: Data,
  query: Query = {}
): Promise<T> {
  const auth: BasicAuth = { user: creds.clientId, pass: creds.clientSecret };
  return core.post(endpoint, `${path}.json`, json, query, userAgent, auth);
}

export async function postForm<T>(
  creds: Credentials,
  userAgent: string,
  path: string,
  form: Data,
  query: Query = {}
): Promise<T> {
  const auth: BasicAuth = { user: creds.clientId, pass: creds.clientSecret };
  return core.postForm(endpoint, `${path}.json`, form, query, userAgent, auth);
}
