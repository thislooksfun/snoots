import type { Data } from "../types";
import type { BasicAuth, Query } from "./core";
import * as core from "./core";

const endpoint = "https://www.reddit.com";

/**
 * Reddit API application credentials
 *
 * To get these values:
 *
 * 1. Log in to Reddit account. If you are writing a bot, use the account you
 *    wish to control.
 * 1. Go to https://www.reddit.com/prefs/apps/.
 * 1. Scroll to the bottom and click 'are you a developer? create an app...'.
 * 1. Select the type of application you wish to make. Most likely this will be
 *    'script'.
 * 1. Put in a name and redirect uri (it don't matter what you put, but you
 *    can't leave them blank).
 * 1. (optional) Add your main account as a developer.
 * 1. The ID is just below the name of the application, and the secret is where
 *    it says "secret"
 *
 * ![Where to find the client ID and secret](media://app_creds.png)
 */
export interface Credentials {
  /** The ID of your Reddit application. */
  clientId: string;

  /** The secret of your Reddit application. */
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
