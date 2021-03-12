import type { Credentials } from "./helper/api/creds";
import type { Token } from "./helper/accessToken";
import type { Data } from "./helper/types";
import type { OauthOpts } from "./helper/api/oauth";
import type { Query } from "./helper/api/core";
import * as anon from "./helper/api/anon";
import * as oauth from "./helper/api/oauth";
import CommentControls from "./controls/comment";
import refreshToken from "./helper/accessToken";

/** Username and password based authentication */
export interface UsernameAuth {
  /** The username of the reddit account to control. */
  username: string;

  /** The password of the reddit account to control. */
  password: string;
}

/** OAuth token based authentication */
export interface TokenAuth {
  /**
   * An OAuth refresh token.
   *
   * Snoots does not provide any way to get a refresh token. If you want to use
   * this code path you have to go through the oauth flow yourself.
   */
  refreshToken: string;
}

/** Some kind of authorization */
export type Auth = UsernameAuth | TokenAuth;

/**
 * Options for instantiating a Client
 */
export interface ClientOptions {
  /**
   * The authorization information for this client to log in with.
   *
   * If this is not specified the client will fall back on
   * [application-only-auth][aoa].
   *
   * [aoa]: https://github.com/reddit-archive/reddit/wiki/OAuth2#application-only-oauth
   */
  auth?: Auth;

  /**
   * The authorization information for this client to log in with.
   *
   * If this is not specified the client will fall back on unauthenticated
   * requests. Leaving this out is almost never what you want to do.
   */
  creds?: Credentials;

  /**
   * The user agent for this client.
   *
   * Every reddit application is required to have a unique user agent that
   * preferably includes the version number.
   */
  userAgent: string;
}

/**
 * The main Client class. This is the primary way you will interact with snoots.
 *
 * Every Client instance is fully independent, so you are free to create as many
 * as you require.
 *
 * @example The most common way to use snoots is to make a client
 * ```ts
 * const client = new Client({
 *   userAgent: '<your user agent>',
 *   auth: {
 *     username: '<your username>',
 *     password: '<your password>',
 *   },
 *   creds: {
 *     clientId: '<your client id>',
 *     clientSecret: '<your client secret>',
 *   },
 * })
 * ```
 *
 *
 * @example If you want to make requests not on behalf of a user, you can leave
 * out the `auth` key. See {@link ClientOptions.auth} for more details.
 * ```ts
 * const client = new Client({
 *   userAgent: '<your user agent>',
 *   creds: {
 *     clientId: '<your client id>',
 *     clientSecret: '<your client secret>',
 *   },
 * });
 * ```
 *
 * @example If you want to make completely unauthenticated requests, you can
 * leave out both the `auth` and `creds` keys. See {@link ClientOptions.creds}
 * for more details and restrictions.
 * ```ts
 * const client = new Client({ userAgent: '<your user agent>' })
 * ```
 */
export default class Client {
  /** Controls for interacting with comments. */
  public comments: CommentControls;
  protected auth?: Auth;
  protected creds?: Credentials;
  protected token: Token | null;
  protected userAgent: string;

  /**
   * Make a new snoots Client.
   *
   * @param opts The options to configure this client with.
   */
  constructor(opts: ClientOptions) {
    this.auth = opts.auth;
    this.creds = opts.creds;
    this.token = null;
    this.userAgent = opts.userAgent;

    // Set up controls after we have initalized the internal state.
    this.comments = new CommentControls(this);
  }

  /**
   * Perform a GET request to the reddit api.
   *
   * You shouldn't ever have to use this directly.
   *
   * @template T The type to cast the response to.
   *
   * @param path The path of the endpoint.
   * @param query Any query parameters to pass to the endpoint.
   *
   * @returns The JSON response from the endpoint.
   *
   * @throws If the endpoint returns an error.
   */
  async get<T>(path: string, query: Query = {}): Promise<T> {
    if (this.creds) {
      return oauth.get(await this.oAuth(), path, query);
    } else {
      return anon.get(this.userAgent, path, query);
    }
  }

  /**
   * Perform a POST request to the reddit api.
   *
   * You shouldn't ever have to use this directly.
   *
   * @template T The type to cast the response to.
   *
   * @param path The path of the endpoint.
   * @param data The data to POST.
   * @param query Any query parameters to pass to the endpoint.
   *
   * @returns The JSON response from the endpoint.
   *
   * @throws If the endpoint returns an error.
   */
  async post<T>(path: string, data: Data, query: Query = {}): Promise<T> {
    if (this.creds) {
      return oauth.post(await this.oAuth(), path, data, query);
    } else {
      return anon.post(this.userAgent, path, data, query);
    }
  }

  protected async updateAccessToken(): Promise<void> {
    if (!this.creds) throw "No creds";

    this.token = await refreshToken(
      this.userAgent,
      this.token,
      this.creds,
      this.auth
    );
  }

  protected async oAuth(): Promise<OauthOpts> {
    await this.updateAccessToken();
    return {
      token: this.token!.access,
      userAgent: this.userAgent,
    };
  }
}
