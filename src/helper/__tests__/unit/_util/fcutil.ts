import type { Auth, TokenAuth, UsernameAuth } from "../../../../client";
import type { Credentials } from "../../../api/creds";
import fc from "fast-check";

export function usernameAuth(): fc.Arbitrary<UsernameAuth> {
  return fc.record({
    username: fc.string(),
    password: fc.string(),
  });
}

export function tokenAuth(): fc.Arbitrary<TokenAuth> {
  return fc.record({
    refreshToken: fc.string(),
  });
}

export function auth(): fc.Arbitrary<Auth> {
  return fc.oneof(usernameAuth(), tokenAuth());
}

export function creds(): fc.Arbitrary<Credentials> {
  return fc.record({
    clientId: fc.string(),
    clientSecret: fc.string(),
  });
}
