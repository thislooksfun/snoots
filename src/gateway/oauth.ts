import type { Data, Maybe } from "../helper/types";
import type { Credentials } from "./creds";
import type { BearerAuth } from "./types";

import { makeDebug } from "../helper/debug";
import { fromRedditData } from "../reddit/util";
import { CredsGateway } from "./creds";
import { Gateway } from "./gateway";

const debug = makeDebug("gateway:oauth");

/** Username and password based authentication */
export interface UsernameAuth {
  /** The username of the reddit account to control. */
  username: string;

  /** The password of the reddit account to control. */
  password: string;
}

/** OAuth token based authentication */
export interface TokenAuth {
  /** An OAuth refresh token. */
  refreshToken: string;
}

/** Some kind of authorization */
export type ClientAuth = UsernameAuth | TokenAuth;

export interface Token {
  access: string;
  expiration: number;
  refresh?: string;
  scopes: string[];
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  scope: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
interface RefreshTokenGrant {
  grant_type: "refresh_token";
  refresh_token: string;
}
interface PasswordGrant {
  grant_type: "password";
  username: string;
  password: string;
}
interface ClientCredentialsGrant {
  grant_type: "client_credentials";
}
interface AuthorizationCodeGrant {
  grant_type: "authorization_code";
  code: string;
  redirect_uri: string;
}
/* eslint-enable @typescript-eslint/naming-convention */

type Grant =
  | RefreshTokenGrant
  | PasswordGrant
  | ClientCredentialsGrant
  | AuthorizationCodeGrant;

/** @internal */
export class OauthGateway extends Gateway {
  protected initialAuth: Maybe<ClientAuth>;
  protected creds: Credentials;
  protected token: Maybe<Token>;

  /** @internal */
  static async fromAuthCode(
    code: string,
    redirectUri: string,
    creds: Credentials,
    userAgent: string
  ): Promise<OauthGateway> {
    const gateway = new OauthGateway({ refreshToken: "" }, creds, userAgent);
    await gateway.updateTokenFromGrant({
      /* eslint-disable @typescript-eslint/naming-convention */
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      /* eslint-enable @typescript-eslint/naming-convention */
    });

    return gateway;
  }

  /** @internal */
  constructor(auth: Maybe<ClientAuth>, creds: Credentials, userAgent: string) {
    super("https://oauth.reddit.com", userAgent);
    this.initialAuth = auth;
    this.creds = creds;
  }

  /** @internal */
  public getRefreshToken(): Maybe<string> {
    return this.token?.refresh;
  }

  /** @internal */
  public getScopes(): Maybe<string[]> {
    return this.token?.scopes;
  }

  protected async auth(): Promise<BearerAuth> {
    await this.ensureTokenValid();
    if (!this.token) throw new Error("Something has gone horribly wrong.");
    return { bearer: this.token.access };
  }

  protected mapPath(path: string): string {
    // api requests against oauth.reddit.com do not need special treatment.
    return path;
  }

  protected async ensureTokenValid(): Promise<void> {
    // If the token is missing or expired, update it.
    const expiresAt = this.token?.expiration ?? 0;
    debug(
      "Checking if token is expired (expires at %d, current time is %d)",
      expiresAt,
      Date.now()
    );
    if (expiresAt <= Date.now()) {
      await this.updateAccessToken();
    }
  }

  protected async updateAccessToken(): Promise<void> {
    let grant: Grant;
    /* eslint-disable @typescript-eslint/naming-convention */
    if (this.token?.refresh) {
      grant = {
        grant_type: "refresh_token",
        refresh_token: this.token.refresh,
      };
    } else if (this.initialAuth) {
      const auth = this.initialAuth;
      grant =
        "refreshToken" in auth
          ? { grant_type: "refresh_token", refresh_token: auth.refreshToken }
          : { grant_type: "password", ...auth };
    } else {
      grant = { grant_type: "client_credentials" };
    }
    /* eslint-enable @typescript-eslint/naming-convention */

    await this.updateTokenFromGrant(grant);
  }

  private async updateTokenFromGrant(grant: Grant) {
    debug("Updating token with grant %o", grant);
    const credGate = new CredsGateway(this.creds, this.userAgent);
    const raw: Data = await credGate.post("api/v1/access_token", grant);
    const response: TokenResponse = fromRedditData(raw);
    this.token = {
      access: response.accessToken,
      expiration: Date.now() + response.expiresIn * 1000,
      refresh: response.refreshToken,
      scopes: response.scope.split(" "),
    };
    debug(
      "Token updated successfully, new token expires at %d and has scopes ['%s']",
      this.token.expiration,
      this.token.scopes.join("', '")
    );
  }
}
