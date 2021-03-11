import type { Credentials } from "./helper/api/creds";

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
  protected userAgent: string;

  constructor(opts: ClientOptions) {
    this.auth = opts.auth;
    this.creds = opts.creds;
    this.userAgent = opts.userAgent;
  }
}
