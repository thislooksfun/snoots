import type { Data, Maybe } from "../helper/types";
import type { Credentials } from "./creds";
import type { BearerAuth } from "./types";

import { camelCaseKeys } from "../helper/util";
import { CredsGateway } from "./creds";
import { Gateway } from "./gateway";

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
export type ClientAuth = UsernameAuth | TokenAuth;

export interface Token {
  access: string;
  expiration: number;
  refresh?: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  scope: string;
}

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

type Grant =
  | RefreshTokenGrant
  | PasswordGrant
  | ClientCredentialsGrant
  | AuthorizationCodeGrant;

/** @internal */
export class OauthGateway extends Gateway {
  protected initialAuth: Maybe<ClientAuth>;
  protected creds: Credentials;
  protected token: Token | null;

  /** @internal */
  static async fromAuthCode(
    code: string,
    redirectUri: string,
    creds: Credentials,
    userAgent: string
  ): Promise<OauthGateway> {
    const gateway = new OauthGateway({ refreshToken: "" }, creds, userAgent);
    await gateway.updateTokenFromGrant({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    });

    return gateway;
  }

  /** @internal */
  constructor(auth: Maybe<ClientAuth>, creds: Credentials, userAgent: string) {
    super("https://oauth.reddit.com", userAgent);
    this.initialAuth = auth;
    this.creds = creds;
    this.token = null;
  }

  /** @internal */
  public getRefreshToken(): string | null {
    return this.token?.refresh ?? null;
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
    if ((this.token?.expiration ?? 0) <= Date.now()) {
      await this.updateAccessToken();
    }
  }

  protected async updateAccessToken(): Promise<void> {
    let grant: Grant;
    if (this.token?.refresh != null) {
      grant = {
        grant_type: "refresh_token",
        refresh_token: this.token.refresh,
      };
    } else if (this.initialAuth) {
      const auth = this.initialAuth;
      if ("refreshToken" in auth) {
        grant = {
          grant_type: "refresh_token",
          refresh_token: auth.refreshToken,
        };
      } else {
        grant = { grant_type: "password", ...auth };
      }
    } else {
      grant = { grant_type: "client_credentials" };
    }

    await this.updateTokenFromGrant(grant);
  }

  private async updateTokenFromGrant(grant: Grant) {
    const credGate = new CredsGateway(this.creds, this.userAgent);
    const raw: Data = await credGate.post("api/v1/access_token", grant);
    const tkns: TokenResponse = camelCaseKeys(raw);
    this.token = {
      access: tkns.accessToken,
      expiration: Date.now() + tkns.expiresIn * 1000,
      refresh: tkns.refreshToken,
    };
  }
}
