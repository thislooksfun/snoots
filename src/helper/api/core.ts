import type { Data } from "../types";
import type { OptionsOfTextResponseBody } from "got";
import got from "got";

/** A mapping of query parameters to add to a request. */
export type Query = Record<string, string | boolean>;

export interface BasicAuth {
  user: string;
  pass: string;
}
export interface BearerAuth {
  bearer: string;
}
export type Auth = BasicAuth | BearerAuth;

export interface RedditJsonResponse<T> {
  json: {
    errors: string[];
    data?: T;
  };
}

interface RedditError {
  error: string;
  error_description?: string;
}

function handleError(msg: string, desc?: string): never {
  let errMsg = `Reddit returned an error: ${msg}`;
  if (desc != null) errMsg += `: ${desc}`;
  throw new Error(errMsg);
}

type SomeResponse<T> = T | RedditError | RedditJsonResponse<T>;
function errWrap<T>(res: SomeResponse<T>): T {
  if ("json" in res) {
    const { errors, data } = res.json;
    if (errors.length > 0) {
      handleError(errors[0]);
    } else if (!data) {
      // TODO: Use custom error type
      throw "No data!";
    } else {
      return data;
    }
  } else {
    if ("error" in res) {
      handleError(res.error, res.error_description);
    } else {
      return res;
    }
  }
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
  form: Data,
  query: Query = {},
  userAgent: string,
  auth?: Auth
): Promise<T> {
  return await _post(path, {
    ...opts(endpoint, userAgent, query, auth),
    form: { api_type: "json", ...form },
  });
}

export async function postJson<T>(
  endpoint: string,
  path: string,
  json: Data,
  query: Query = {},
  userAgent: string,
  auth?: Auth
): Promise<T> {
  return await _post(path, {
    ...opts(endpoint, userAgent, query, auth),
    json: { api_type: "json", ...json },
  });
}
