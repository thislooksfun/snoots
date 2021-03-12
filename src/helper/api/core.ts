import type { Data } from "../types";
import type { OptionsOfTextResponseBody } from "got";
import got from "got";

/** A mapping of query parameters to add to a request. */
export type Query = Record<string, string>;

export interface BasicAuth {
  user: string;
  pass: string;
}
export interface BearerAuth {
  bearer: string;
}
export type Auth = BasicAuth | BearerAuth;

interface RedditError {
  error: string;
  error_description?: string;
}

function errWrap<T>(res: RedditError | T): T {
  if (!("error" in res)) return res;

  let errMsg = `Reddit returned an error: ${res.error}`;
  if (res.error_description != null) {
    errMsg += `: ${res.error_description}`;
  }

  throw new Error(errMsg);
}

function opts(
  prefixUrl: string,
  ua: string,
  query: Query,
  auth?: Auth
): OptionsOfTextResponseBody {
  const o: OptionsOfTextResponseBody = {
    prefixUrl,
    headers: { "user-agent": ua },
    searchParams: { ...query, raw_json: 1, api_type: "json" },
  };

  if (auth) {
    if ("bearer" in auth) {
      o.headers!["Authorization"] = `bearer ${auth.bearer}`;
    } else {
      o.username = auth.user;
      o.password = auth.pass;
    }
  }

  return o;
}

type GotOptions = OptionsOfTextResponseBody;
async function _get<T>(url: string, options?: GotOptions): Promise<T> {
  // console.log(`GET > ${url}`, options);
  try {
    let res: T = await got.get(url, options).json();
    return errWrap(res);
  } catch (e) {
    // TODO: Deal with ratelimit (err 429).
    throw e;
  }
}
async function _post<T>(url: string, options?: GotOptions): Promise<T> {
  // console.log(`POST > ${url}`, options);
  try {
    let res: T = await got.post(url, options).json();
    return errWrap(res);
  } catch (e) {
    // TODO: Deal with ratelimit (err 429).
    throw e;
  }
}

export async function get<T>(
  endpoint: string,
  path: string,
  query: Query = {},
  userAgent: string,
  auth?: Auth
): Promise<T> {
  return await _get(path, opts(endpoint, userAgent, query, auth));
}

export async function post<T>(
  endpoint: string,
  path: string,
  json: Data,
  query: Query = {},
  userAgent: string,
  auth?: Auth
): Promise<T> {
  return await _post(path, {
    ...opts(endpoint, userAgent, query, auth),
    json,
  });
}

export async function postForm<T>(
  endpoint: string,
  path: string,
  form: Data,
  query: Query = {},
  userAgent: string,
  auth?: Auth
): Promise<T> {
  return await _post(path, {
    ...opts(endpoint, userAgent, query, auth),
    form,
  });
}
