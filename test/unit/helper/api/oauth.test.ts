import nock from "nock";
import * as oauth from "../../../../src/helper/api/oauth";

afterEach(() => nock.cleanAll());
afterAll(() => nock.restore());

describe("get()", () => {
  it("should pass common values", async () => {
    const n = nock("https://oauth.reddit.com")
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    await oauth.get(oo, "foo/bar", {});

    // TODO: Add tests for user agent and auth.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://oauth.reddit.com")
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    const req = oauth.get(oo, "foo/bar", {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://oauth.reddit.com")
        .get("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.get(oo, "foo/bar", {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock("https://oauth.reddit.com")
        .get("/foo/bar?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.get(oo, "foo/bar", {});
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});

describe("post()", () => {
  it("should pass common values", async () => {
    const n = nock("https://oauth.reddit.com")
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    await oauth.post(oo, "foo/bar", { bar: "foo" }, {});

    // TODO: Add tests for body, user agent, and auth.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://oauth.reddit.com")
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    const req = oauth.post(oo, "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://oauth.reddit.com")
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.post(oo, "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock("https://oauth.reddit.com")
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.post(oo, "foo/bar", { bar: "foo" }, {});
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});

describe("postJson()", () => {
  it("should pass common values", async () => {
    const n = nock("https://oauth.reddit.com")
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    await oauth.postJson(oo, "foo/bar", { bar: "foo" }, {});

    // TODO: Add tests for body, user agent, and auth.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://oauth.reddit.com")
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    const req = oauth.postJson(oo, "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://oauth.reddit.com")
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.postJson(oo, "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock("https://oauth.reddit.com")
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.postJson(oo, "foo/bar", { bar: "foo" }, {});
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});
