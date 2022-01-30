import type { ClientAuth, Token, TokenResponse } from "../../oauth";

import fc from "fast-check";
import nock from "nock";

import { Maybe } from "../../..";
import { OauthGateway } from "../../oauth";

const fcUsernameAuth = () =>
  fc.record({ username: fc.string(), password: fc.string() });
const fcTokenAuth = () => fc.record({ refreshToken: fc.string() });
const fcClientAuth = () => fc.oneof(fcUsernameAuth(), fcTokenAuth());

function fcToken(withRefresh?: boolean): fc.Arbitrary<Token> {
  const access = fc.string();
  const expiration = fc.integer().map(i => i + Date.now());
  const refresh = fc.string({ minLength: 1 });

  if (withRefresh === true) {
    return fc.record({ access, expiration, refresh });
  } else if (withRefresh === false) {
    return fc.record({ access, expiration });
  } else {
    // No preference given, randomize whether or not there is a refresh token.
    return fc.record(
      { access, expiration, refresh },
      { requiredKeys: ["access", "expiration"] }
    );
  }
}

function fcTokenResponse(): fc.Arbitrary<TokenResponse> {
  return fc.record({
    accessToken: fc.string(),
    tokenType: fc.string(),
    expiresIn: fc.integer({ min: 1000, max: 10000 }),
    scope: fc.string(),
  });
}

// Test class to make protected methods public.
class PublicOauthGateway extends OauthGateway {
  public getToken(): Maybe<Token> {
    return this.token;
  }
  public setToken(token: Maybe<Token>) {
    this.token = token;
  }

  public setInitialAuth(auth: Maybe<ClientAuth>) {
    this.initialAuth = auth;
  }

  public updateAccessToken(): Promise<void> {
    return super.updateAccessToken();
  }
}

let gateway: PublicOauthGateway;

beforeAll(() => {
  nock.disableNetConnect();

  const auth = { refreshToken: "refreshTkn" };
  const creds = { clientId: "cId", clientSecret: "cSecret" };
  gateway = new PublicOauthGateway(auth, creds, "fake-user-agent");
});

afterEach(() => {
  nock.cleanAll();
  jest.restoreAllMocks();
});

afterAll(() => {
  nock.restore();
  nock.enableNetConnect();
});

describe("OauthGateway", () => {
  let updateAccessTokenSpy: jest.SpyInstance;

  beforeEach(() => {
    updateAccessTokenSpy = jest.spyOn(gateway, "updateAccessToken");
  });

  describe(".updateAccessToken()", () => {
    const commonNockOptions = {
      reqheaders: {
        "user-agent": "fake-user-agent",
        authorization: "Basic Y0lkOmNTZWNyZXQ=",
      },
    };

    it("uses the stored refresh token, if it has one", async () => {
      await fc.assert(
        fc.asyncProperty(fcToken(true), async token => {
          gateway.setToken(token);

          const body = {
            api_type: "json",
            grant_type: "refresh_token",
            refresh_token: token.refresh,
          };
          const n = nock("https://www.reddit.com", commonNockOptions)
            .post("/api/v1/access_token.json?raw_json=1&api_type=json", body)
            .reply(200, { bim: "bom" });

          await gateway.updateAccessToken();

          n.done();
        })
      );
    });

    it("falls back on the initialAuth if it has no stored refresh token", async () => {
      await fc.assert(
        fc.asyncProperty(
          fcToken(false),
          fcClientAuth(),
          async (token, auth) => {
            gateway.setToken(token);
            gateway.setInitialAuth(auth);

            const body = {
              api_type: "json",
              ...("refreshToken" in auth
                ? {
                    grant_type: "refresh_token",
                    refresh_token: auth.refreshToken,
                  }
                : { grant_type: "password", ...auth }),
            };
            const n = nock("https://www.reddit.com", commonNockOptions)
              .post("/api/v1/access_token.json?raw_json=1&api_type=json", body)
              .reply(200, { bim: "bom" });

            await gateway.updateAccessToken();

            n.done();
          }
        )
      );
    });

    it("falls on client credentials auth if it has no stored refresh token and no initial auth", async () => {
      await fc.assert(
        fc.asyncProperty(fcToken(false), async token => {
          gateway.setToken(token);
          gateway.setInitialAuth(undefined);

          const body = { api_type: "json", grant_type: "client_credentials" };
          const n = nock("https://www.reddit.com", commonNockOptions)
            .post("/api/v1/access_token.json?raw_json=1&api_type=json", body)
            .reply(200, { bim: "bom" });

          await gateway.updateAccessToken();

          n.done();
        })
      );
    });

    it("sets the stored token from the response", async () => {
      await fc.assert(
        fc.asyncProperty(
          fcToken(),
          fcClientAuth(),
          fcTokenResponse(),
          async (token, auth, tokenResponse) => {
            gateway.setToken(token);
            gateway.setInitialAuth(auth);

            const n = nock("https://www.reddit.com", commonNockOptions)
              .post("/api/v1/access_token.json?raw_json=1&api_type=json")
              .reply(200, tokenResponse);

            await gateway.updateAccessToken();

            n.done();

            const newToken = gateway.getToken();
            expect(newToken).not.toBeNull();
            expect(newToken).not.toBe(token);
            expect(newToken?.access).toEqual(tokenResponse.accessToken);
            expect(newToken?.expiration).toBeGreaterThan(Date.now());
            expect(newToken?.refresh).toEqual(tokenResponse.refreshToken);
          }
        )
      );
    });
  });

  describe.each([
    ["not authenticated", undefined],
    [
      "access has expired",
      { access: "accessTkn", expiration: Date.now() - 9000 },
    ],
  ])("When %s", (_msg, token) => {
    beforeEach(() => {
      gateway.setToken(token);
      updateAccessTokenSpy.mockImplementation(async () => {
        gateway.setToken({ access: "accessTkn", expiration: 0 });
      });
    });

    describe(".get()", () => {
      it("should call .updateAccessToken()", async () => {
        const n = nock("https://oauth.reddit.com")
          .get("/foo/bar?api_type=json&raw_json=1")
          .reply(200, { bim: "bom" });

        await gateway.get("foo/bar");

        n.done();
        expect(updateAccessTokenSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe(".post()", () => {
      it("should call .updateAccessToken()", async () => {
        const n = nock("https://oauth.reddit.com")
          .post("/foo/bar?api_type=json&raw_json=1")
          .reply(200, { bim: "bom" });

        await gateway.post("foo/bar", {});

        n.done();
        expect(updateAccessTokenSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe(".postJson()", () => {
      it("should call .updateAccessToken()", async () => {
        const n = nock("https://oauth.reddit.com")
          .post("/foo/bar?api_type=json&raw_json=1")
          .reply(200, { bim: "bom" });

        await gateway.postJson("foo/bar", {});

        n.done();
        expect(updateAccessTokenSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("When authenticated", () => {
    const commonNockOptions = {
      reqheaders: {
        "user-agent": "fake-user-agent",
        authorization: "bearer accessTkn",
      },
    };

    beforeEach(() => {
      gateway.setToken({ access: "accessTkn", expiration: Date.now() + 9000 });
    });

    describe(".get()", () => {
      it("should pass common values", async () => {
        const n = nock("https://oauth.reddit.com", commonNockOptions)
          .get("/foo/bar?api_type=json&raw_json=1")
          .reply(200, { bim: "bom" });

        await gateway.get("foo/bar", {});

        n.done();
      });

      it("should give back json data", async () => {
        const n = nock("https://oauth.reddit.com", commonNockOptions)
          .get("/foo/bar?api_type=json&raw_json=1")
          .reply(200, { bim: "bom" });

        const req = gateway.get("foo/bar", {});
        await expect(req).resolves.toStrictEqual({ bim: "bom" });

        n.done();
      });

      it("should not call .updateAccessToken()", async () => {
        nock("https://oauth.reddit.com").get(/.*/).reply(200);
        await gateway.get("foo/bar");
        expect(updateAccessTokenSpy).not.toHaveBeenCalled();
      });

      describe("when given an api error", () => {
        it("should throw", async () => {
          const n = nock("https://oauth.reddit.com", commonNockOptions)
            .get("/foo/bar?api_type=json&raw_json=1")
            .reply(200, { error: "whoops" });

          const req = gateway.get("foo/bar", {});
          const err = new Error("Reddit returned an error: whoops");
          await expect(req).rejects.toStrictEqual(err);

          n.done();
        });

        it("should use the description if available", async () => {
          const n = nock("https://oauth.reddit.com", commonNockOptions)
            .get("/foo/bar?api_type=json&raw_json=1")
            .reply(200, {
              error: "whoops",
              error_description: "something went wrong :(",
            });

          const req = gateway.get("foo/bar", {});
          const err = new Error(
            "Reddit returned an error: whoops: something went wrong :("
          );
          await expect(req).rejects.toStrictEqual(err);

          n.done();
        });
      });
    });

    describe(".post()", () => {
      it("should pass common values", async () => {
        const expectedBody = { api_type: "json", bar: "foo" };
        const n = nock("https://oauth.reddit.com", commonNockOptions)
          .post("/foo/bar?api_type=json&raw_json=1", expectedBody)
          .reply(200, { bim: "bom" });

        await gateway.post("foo/bar", { bar: "foo" }, {});

        n.done();
      });

      it("should give back json data", async () => {
        const n = nock("https://oauth.reddit.com", commonNockOptions)
          .post("/foo/bar?api_type=json&raw_json=1")
          .reply(200, { bim: "bom" });

        const req = gateway.post("foo/bar", { bar: "foo" }, {});
        await expect(req).resolves.toStrictEqual({ bim: "bom" });

        n.done();
      });

      it("should not call .updateAccessToken()", async () => {
        nock("https://oauth.reddit.com").post(/.*/).reply(200);
        await gateway.post("foo/bar", {});
        expect(updateAccessTokenSpy).not.toHaveBeenCalled();
      });

      describe("when given an api error", () => {
        it("should throw", async () => {
          const n = nock("https://oauth.reddit.com", commonNockOptions)
            .post("/foo/bar?api_type=json&raw_json=1")
            .reply(200, { error: "whoops" });

          const req = gateway.post("foo/bar", { bar: "foo" }, {});
          const err = new Error("Reddit returned an error: whoops");
          await expect(req).rejects.toStrictEqual(err);

          n.done();
        });

        it("should use the description if available", async () => {
          const n = nock("https://oauth.reddit.com", commonNockOptions)
            .post("/foo/bar?api_type=json&raw_json=1")
            .reply(200, {
              error: "whoops",
              error_description: "something went wrong :(",
            });

          const req = gateway.post("foo/bar", { bar: "foo" }, {});
          const err = new Error(
            "Reddit returned an error: whoops: something went wrong :("
          );
          await expect(req).rejects.toStrictEqual(err);

          n.done();
        });
      });
    });

    describe(".postJson()", () => {
      it("should pass common values", async () => {
        const expectedBody = { api_type: "json", bar: "foo" };
        const n = nock("https://oauth.reddit.com", commonNockOptions)
          .post("/foo/bar?api_type=json&raw_json=1", expectedBody)
          .reply(200, { bim: "bom" });

        await gateway.postJson("foo/bar", { bar: "foo" }, {});

        n.done();
      });

      it("should give back json data", async () => {
        const n = nock("https://oauth.reddit.com", commonNockOptions)
          .post("/foo/bar?api_type=json&raw_json=1")
          .reply(200, { bim: "bom" });

        const req = gateway.postJson("foo/bar", { bar: "foo" }, {});
        await expect(req).resolves.toStrictEqual({ bim: "bom" });

        n.done();
      });

      it("should not call .updateAccessToken()", async () => {
        nock("https://oauth.reddit.com").post(/.*/).reply(200);
        await gateway.postJson("foo/bar", {});
        expect(updateAccessTokenSpy).not.toHaveBeenCalled();
      });

      describe("when given an api error", () => {
        it("should throw", async () => {
          const n = nock("https://oauth.reddit.com", commonNockOptions)
            .post("/foo/bar?api_type=json&raw_json=1")
            .reply(200, { error: "whoops" });

          const req = gateway.postJson("foo/bar", { bar: "foo" }, {});
          const err = new Error("Reddit returned an error: whoops");
          await expect(req).rejects.toStrictEqual(err);

          n.done();
        });

        it("should use the description if available", async () => {
          const n = nock("https://oauth.reddit.com", commonNockOptions)
            .post("/foo/bar?api_type=json&raw_json=1")
            .reply(200, {
              error: "whoops",
              error_description: "something went wrong :(",
            });

          const req = gateway.postJson("foo/bar", { bar: "foo" }, {});
          const err = new Error(
            "Reddit returned an error: whoops: something went wrong :("
          );
          await expect(req).rejects.toStrictEqual(err);

          n.done();
        });
      });
    });
  });
});
