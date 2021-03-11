import type { Auth } from "../../src/client";
import type { Credentials } from "../../src/helper/api/creds";
import fc from "fast-check";

export function auth(): fc.Arbitrary<Auth> {
  return fc.oneof(
    fc.record({
      username: fc.string(),
      password: fc.string(),
    }),
    fc.record({
      refreshToken: fc.string(),
    })
  );
}

export function creds(): fc.Arbitrary<Credentials> {
  return fc.record({
    clientId: fc.string(),
    clientSecret: fc.string(),
  });
}
