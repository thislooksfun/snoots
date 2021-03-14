import type { Token, TokenResponse } from "../../src/helper/accessToken";
import fc from "fast-check";
import * as fcutil from "../_util/fcutil";
import nock from "nock";
import updateAccessToken from "../../src/helper/accessToken";

// Mocking
import * as creds from "../../src/helper/api/creds";
jest.mock("../../src/helper/api/creds");
const post = creds.post as jest.Mock;

// Just in case something slips through, don't actually ping reddit.
beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

function token(offset: { max?: number; min?: number }): fc.Arbitrary<Token> {
  return fc.record({
    access: fc.string(),
    expiration: fc.integer(offset).map(i => i + Date.now()),
  });
}

function tknResponse(): fc.Arbitrary<TokenResponse> {
  return fc.record({
    accessToken: fc.string(),
    tokenType: fc.string(),
    expiresIn: fc.integer({ min: 1000, max: 10000 }),
    scope: fc.string(),
  });
}

describe("updateAccessToken()", () => {
  it("should return the token if it hasn't expired", async () => {
    await fc.assert(
      fc.asyncProperty(
        token({ min: 1000 }),
        fcutil.auth(),
        fcutil.creds(),
        fc.string(),
        async (tkn, auth, creds, agent) => {
          post.mockReset();
          const prms = updateAccessToken(agent, tkn, creds, auth);
          await expect(prms).resolves.toStrictEqual(tkn);
          expect(post).not.toBeCalled();
        }
      )
    );
  });

  it("should fetch a new token if the current one has expired", async () => {
    await fc.assert(
      fc.asyncProperty(
        token({ max: -1000 }),
        fcutil.auth(),
        fcutil.creds(),
        tknResponse(),
        fc.string(),
        async (tkn, auth, creds, newTkn, agent) => {
          post.mockReset().mockReturnValue(newTkn);

          const prms = await updateAccessToken(agent, tkn, creds, auth);
          expect(post).toBeCalled();

          expect(prms.access).toEqual(newTkn.accessToken);
          expect(prms.expiration).toBeGreaterThan(Date.now());
        }
      )
    );
  });

  xdescribe("grants", () => {
    // TODO: Test that different auths request different grants.
    // BODY: Using a TokenAuth should request a `refresh_token` grant. Using a
    // BODY: UsernameAuth should request a `password` grant, and using no auth
    // BODY: should request a client_credentials grant. This is currently
    // BODY: pending https://github.com/nock/nock/issues/2171.
  });
});
