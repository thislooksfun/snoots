import type { Auth } from "../client";
import type { Data } from "./types";
import type { Credentials } from "./api/creds";
import { postForm } from "./api/creds";
import { camelCaseKeys } from "./util";

export interface Token {
  access: string;
  expiration: number;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
}

export default async function updateAccessToken(
  token: Token | null,
  auth: Auth,
  creds: Credentials,
  userAgent: string
): Promise<Token> {
  const expiration = token?.expiration ?? 0;
  if (expiration > Date.now()) return token!;

  // Token is expired or missing, time to (re)generate!
  let grant: Data = {};
  if ("refreshToken" in auth) {
    grant.grant_type = "refresh_token";
    grant.refresh_token = auth.refreshToken;
  } else {
    grant.grant_type = "password";
    grant.username = auth.username;
    grant.password = auth.password;
  }

  const raw: Data = await postForm(
    creds,
    userAgent,
    "api/v1/access_token",
    grant,
    {}
  );

  const tkns: TokenResponse = camelCaseKeys(raw);
  return {
    access: tkns.accessToken,
    expiration: Date.now() + tkns.expiresIn * 1000,
  };
}
