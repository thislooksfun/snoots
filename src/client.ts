import type { Credentials } from "./gateway/creds";
import type { Gateway } from "./gateway/gateway";
import type { ClientAuth } from "./gateway/oauth";
import type { RateLimit } from "./gateway/types";
import type { Maybe } from "./helper/types";

import { AnonGateway } from "./gateway/anon";
import { OauthGateway } from "./gateway/oauth";
import { makeDebug } from "./helper/debug";
import { CommentControls } from "./reddit/comment/controls";
import { PostControls } from "./reddit/post/controls";
import { SubredditControls } from "./reddit/subreddit/controls";
import { MyUserControls } from "./reddit/user/my-user/controls";
import { UserControls } from "./reddit/user/other-user/controls";
import { WikiControls } from "./reddit/wiki/controls";

const debug = makeDebug("class:Client");

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
  auth?: ClientAuth;

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
   * Every reddit application is required to have a unique user agent. From
   * Reddit's [API rules][rls]:
   *
   * > * Change your client's User-Agent string to something unique and
   * >   descriptive, including the target platform, a unique application
   * >   identifier, a version string, and your username as contact
   * >   information, in the following format:
   * >   `<platform>:<app ID>:<version string> (by /u/<reddit username>)`
   * >     * Example: `User-Agent: android:com.example.myredditapp:v1.2.3 (by
   * >       /u/kemitche)`
   * >     * Many default User-Agents (like "Python/urllib" or "Java") are
   * >       drastically limited to encourage unique and descriptive user-agent
   * >       strings.
   * >     * Including the version number and updating it as you build your
   * >       application allows us to safely block old buggy/broken versions of
   * >       your app.
   * >     * **NEVER lie about your user-agent.** This includes spoofing
   * >       popular browsers and spoofing other bots. We will ban liars with
   * >       extreme prejudice.
   *
   * [rls]: https://github.com/reddit-archive/reddit/wiki/api#rules
   */
  userAgent: string;
}

/**
 * The main Client class. This is the primary way you will interact with
 * snoots.
 *
 * Every Client instance is fully independent, so you are free to create as
 * many as you require.
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
 * @example If you already have a refresh token from a previous session you can
 * use that as well.
 * ```ts
 * const client = new Client({
 *   userAgent: '<your user agent>',
 *   auth: {
 *     refreshToken: '<the token>',
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
 *
 * @example If you want to make completely unauthenticated requests, you can
 * leave out both the `auth` and `creds` keys. See {@link ClientOptions.creds}
 * for more details and restrictions.
 * ```ts
 * const client = new Client({ userAgent: '<your user agent>' })
 * ```
 */
export class Client {
  /** Controls for interacting with comments. */
  public readonly comments: CommentControls;
  /** Controls for interacting with the currently authorized user. */
  public readonly me: MyUserControls;
  /** Controls for interacting with posts. */
  public readonly posts: PostControls;
  /** Controls for interacting with subreddits. */
  public readonly subreddits: SubredditControls;
  /** Controls for interacting with users. */
  public readonly users: UserControls;
  /** Controls for interacting with wiki pages */
  public readonly wiki: WikiControls;

  /**
   * The Gateway to the Reddit API.
   *
   * You can use this directly, but you most likely don't want to. If you end
   * up needing this in order to interact with the Reddit API please open an
   * issue or submit a pull request so we can add official support for your use
   * case.
   *
   * @internal
   */
  public readonly gateway: Gateway;

  /**
   * Get the last-known rate limit status for this client.
   *
   * @note The rate limit status is only updated when a request is made from
   * this client. It will also get out of sync if there are multiple clients
   * using the same authorization (and thus the same rate limit pool).
   */
  get rateLimit(): Maybe<RateLimit> {
    return this.gateway.getRateLimit();
  }

  /**
   * Make a new snoots Client.
   *
   * @param options The options to configure this client with.
   */
  constructor(options: ClientOptions);
  /** @internal */
  constructor(options: ClientOptions, _gateway: Gateway);
  constructor(options: ClientOptions, _gateway?: Gateway) {
    debug("Creating new Client from options %O", options);
    debug("Has auth = %b; has creds = %b", options.auth, options.creds);

    if (_gateway) {
      this.gateway = _gateway;
      debug("Using given gateway; type = %s", this.gateway.constructor.name);
    } else {
      this.gateway = options.creds
        ? new OauthGateway(options.auth, options.creds, options.userAgent)
        : new AnonGateway(options.userAgent);

      debug(
        "Created Gateway for client; type = %s",
        this.gateway.constructor.name
      );
    }

    // Set up controls after we have initialized the internal state.
    this.comments = new CommentControls(this);
    this.me = new MyUserControls(this);
    this.posts = new PostControls(this);
    this.subreddits = new SubredditControls(this);
    this.users = new UserControls(this);
    this.wiki = new WikiControls(this);
  }

  /**
   * Make an OAuth login url.
   *
   * @param clientId The ID of the Reddit app.
   * @param scopes The scopes to authorize with.
   * @param redirectUri The uri to redirect to after authorization.
   * @param state Some arbitrary state that will be passed back upon
   * authorization. This is used as a CSRF token to prevent various attacks.
   * @param temporary Whether the auth should be temporary (expires after 1hr),
   * or permanent.
   *
   * @returns The URL to direct the user to for authorization.
   */
  static makeAuthUrl(
    clientId: string,
    scopes: string[],
    redirectUri: string,
    state: string = "snoots",
    temporary: boolean = false
  ): string {
    const q = new URLSearchParams();
    q.append("client_id", clientId);
    q.append("response_type", "code");
    q.append("state", state);
    q.append("redirect_uri", redirectUri);
    q.append("duration", temporary ? "temporary" : "permanent");
    q.append("scope", scopes.join(" "));

    return `https://www.reddit.com/api/v1/authorize?${q.toString()}`;
  }

  /**
   * Create a client from an OAuth code.
   *
   * @template Self Client or a subclass of Client.
   * @param this The Client subclass. This is only used for typescript to work
   * with subclasses, this is not actually a parameter.
   * @param options The Client options.
   * @param code The OAuth code.
   * @param redirectUri The redirect URI. This ***must*** be the same as the uri
   * given to {@link makeAuthUrl}.
   *
   * @returns A promise that resolves when the authorization is complete.
   */
  static async fromAuthCode<Self extends typeof Client>(
    this: Self,
    options: Required<Omit<ClientOptions, "auth">>,
    code: string,
    redirectUri: string
  ): Promise<InstanceType<Self>> {
    debug("Creating client from auth code '%s'", code);
    if (!options.creds) throw "No creds";

    const gateway = await OauthGateway.fromAuthCode(
      code,
      redirectUri,
      options.creds,
      options.userAgent
    );

    const client = new this(options, gateway);
    return client as InstanceType<Self>;
  }

  /**
   * Get the refresh token for the current session, if there is one.
   *
   * @returns The refresh token, or `undefined` if no token exists.
   */
  getRefreshToken(): Maybe<string> {
    if (this.gateway instanceof OauthGateway) {
      return this.gateway.getRefreshToken();
    }
    return undefined;
  }

  /**
   * Get the set of authorized scopes for the current session.
   *
   * @returns The scopes, or `undefined` if no oauth session exists.
   */
  getAuthorizedScopes(): Maybe<string[]> {
    if (this.gateway instanceof OauthGateway) {
      return this.gateway.getScopes();
    }
    return undefined;
  }
}
