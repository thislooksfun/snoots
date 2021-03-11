import type { Credentials } from "./helper/api/creds";
import type { Token } from "./helper/accessToken";
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
}
