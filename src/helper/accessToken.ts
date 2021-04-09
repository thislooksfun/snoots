import type { Auth } from "../client";
import type { Data } from "./types";
import type { Credentials } from "./api/creds";
import { post } from "./api/creds";
import { camelCaseKeys } from "./util";

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

function rawToToken(raw: Data): Token {
  const tkns: TokenResponse = camelCaseKeys(raw);
  return {
    access: tkns.accessToken,
    expiration: Date.now() + tkns.expiresIn * 1000,
    refresh: tkns.refreshToken,
  };
}

export async function updateAccessToken(
  userAgent: string,
  token: Token | null,
  creds: Credentials,
  auth?: Auth
): Promise<Token> {
  const expiration = token?.expiration ?? 0;
  if (expiration > Date.now()) return token!;

  // Token is expired or missing, time to (re)generate!
  let grant: Data = {};
  if (auth) {
    if (token?.refresh != null) {
      grant.grant_type = "refresh_token";
      grant.refresh_token = token.refresh;
    } else if ("refreshToken" in auth) {
      grant.grant_type = "refresh_token";
      grant.refresh_token = auth.refreshToken;
    } else {
      grant.grant_type = "password";
      grant.username = auth.username;
      grant.password = auth.password;
    }
  } else {
    grant.grant_type = "client_credentials";
  }

  const raw: Data = await post(
    creds,
    userAgent,
    "api/v1/access_token",
    grant,
    {}
  );

  return rawToToken(raw);
}

export async function tokenFromCode(
  code: string,
  creds: Credentials,
  userAgent: string,
  redirectUri: string
): Promise<Token> {
  const raw: Data = await post(creds, userAgent, "api/v1/access_token", {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  return rawToToken(raw);
}
