import type { Credentials } from "./helper/api/creds";
import type { Token } from "./helper/accessToken";
import type { Data } from "./helper/types";
import type { OauthOpts } from "./helper/api/oauth";
import type { Query } from "./helper/api/core";
import * as anon from "./helper/api/anon";
import * as oauth from "./helper/api/oauth";
import refreshToken from "./helper/accessToken";

export interface UsernameAuth {
  username: string;
  password: string;
}
export interface TokenAuth {
  refreshToken: string;
}
export type Auth = UsernameAuth | TokenAuth;

export interface ClientOptions {
  auth?: Auth;
  creds?: Credentials;
  userAgent: string;
}

export default class Client {
  protected auth?: Auth;
  protected creds?: Credentials;
  protected token: Token | null;
  protected userAgent: string;

  constructor(opts: ClientOptions) {
    this.auth = opts.auth;
    this.creds = opts.creds;
    this.token = null;
    this.userAgent = opts.userAgent;
  }

  async get<T>(path: string, query: Query = {}): Promise<T> {
    if (this.creds) {
      return oauth.get(await this.oAuth(), path, query);
    } else {
      return anon.get(this.userAgent, path, query);
    }
  }
  async post<T>(path: string, data: Data, query: Query = {}): Promise<T> {
    if (this.creds) {
      return oauth.post(await this.oAuth(), path, data, query);
    } else {
      return anon.post(this.userAgent, path, data, query);
    }
  }

  protected async updateAccessToken(): Promise<void> {
    if (!this.auth) throw "No auth";
    if (!this.creds) throw "No creds";

    this.token = await refreshToken(
      this.token,
      this.auth,
      this.creds,
      this.userAgent
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
