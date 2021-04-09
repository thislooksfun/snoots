import type { Token, TokenResponse } from "../../../src/helper/accessToken";
import fc from "fast-check";
import * as fcutil from "../_util/fcutil";
import nock from "nock";
import { updateAccessToken } from "../../../src/helper/accessToken";

// Mocking
import * as creds from "../../../src/helper/api/creds";
jest.mock("../../../src/helper/api/creds");
const post = creds.post as jest.Mock;

// Just in case something slips through, don't actually ping reddit.
beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

function token(
  offset: { max?: number; min?: number },
  refresh?: boolean
): fc.Arbitrary<Token> {
  if (refresh == null) {
    return fc.record(
      {
        access: fc.string(),
        expiration: fc.integer(offset).map(i => i + Date.now()),
        refresh: fc.string(),
      },
      { requiredKeys: ["access", "expiration"] }
    );
  }

  if (refresh) {
    return fc.record({
      access: fc.string(),
      expiration: fc.integer(offset).map(i => i + Date.now()),
      refresh: fc.string(),
    });
  }

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

  describe("grants", () => {
    it("should be set correctly for username auth", async () => {
      await fc.assert(
        fc.asyncProperty(
          token({ max: -1000 }, false),
          fcutil.usernameAuth(),
          fcutil.creds(),
          tknResponse(),
          fc.string(),
          async (tkn, auth, creds, newTkn, agent) => {
            post.mockReset().mockReturnValue(newTkn);

            await updateAccessToken(agent, tkn, creds, auth);

            expect(post).toBeCalled();
            const args = post.mock.calls[0];
            expect(args.length).toBeGreaterThanOrEqual(4);
            expect(args[3]).toStrictEqual({
              grant_type: "password",
              username: auth.username,
              password: auth.password,
            });
          }
        )
      );
    });

    it("should be set correctly for first-time token auth", async () => {
      await fc.assert(
        fc.asyncProperty(
          token({ max: -1000 }, false),
          fcutil.tokenAuth(),
          fcutil.creds(),
          tknResponse(),
          fc.string(),
          async (tkn, auth, creds, newTkn, agent) => {
            post.mockReset().mockReturnValue(newTkn);

            await updateAccessToken(agent, tkn, creds, auth);

            expect(post).toBeCalled();
            const args = post.mock.calls[0];
            expect(args.length).toBeGreaterThanOrEqual(4);
            expect(args[3]).toStrictEqual({
              grant_type: "refresh_token",
              refresh_token: auth.refreshToken,
            });
          }
        )
      );
    });

    it("should be set correctly for second-time token auth", async () => {
      await fc.assert(
        fc.asyncProperty(
          token({ max: -1000 }, true),
          fcutil.tokenAuth(),
          fcutil.creds(),
          tknResponse(),
          fc.string(),
          async (tkn, auth, creds, newTkn, agent) => {
            post.mockReset().mockReturnValue(newTkn);

            await updateAccessToken(agent, tkn, creds, auth);

            expect(post).toBeCalled();
            const args = post.mock.calls[0];
            expect(args.length).toBeGreaterThanOrEqual(4);
            expect(args[3]).toStrictEqual({
              grant_type: "refresh_token",
              refresh_token: tkn.refresh,
            });
          }
        )
      );
    });

    it("should be set correctly for creds-only auth", async () => {
      await fc.assert(
        fc.asyncProperty(
          token({ max: -1000 }, true),
          fcutil.creds(),
          tknResponse(),
          fc.string(),
          async (tkn, creds, newTkn, agent) => {
            post.mockReset().mockReturnValue(newTkn);

            await updateAccessToken(agent, tkn, creds);

            expect(post).toBeCalled();
            const args = post.mock.calls[0];
            expect(args.length).toBeGreaterThanOrEqual(4);
            expect(args[3]).toStrictEqual({ grant_type: "client_credentials" });
          }
        )
      );
    });
  });
});
