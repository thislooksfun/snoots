import nock from "nock";
import * as oauth from "../../../../src/helper/api/oauth";

beforeAll(() => nock.disableNetConnect());
afterEach(() => nock.cleanAll());
afterAll(() => {
  nock.restore();
  nock.enableNetConnect();
});

describe("get()", () => {
  it("should pass common values", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "bearer sometkn",
      },
    };
    const n = nock("https://oauth.reddit.com", opts)
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    await oauth.get(oo, "foo/bar", {});

    n.done();
  });

  it("should give back json data", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "bearer sometkn",
      },
    };
    const n = nock("https://oauth.reddit.com", opts)
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    const req = oauth.get(oo, "foo/bar", {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "bearer sometkn",
        },
      };
      const n = nock("https://oauth.reddit.com", opts)
        .get("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.get(oo, "foo/bar", {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "bearer sometkn",
        },
      };
      const n = nock("https://oauth.reddit.com", opts)
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
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "bearer sometkn",
      },
    };
    const expectedBody = { api_type: "json", bar: "foo" };
    const n = nock("https://oauth.reddit.com", opts)
      .post("/foo/bar?api_type=json&raw_json=1", expectedBody)
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    await oauth.post(oo, "foo/bar", { bar: "foo" }, {});

    n.done();
  });

  it("should give back json data", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "bearer sometkn",
      },
    };
    const n = nock("https://oauth.reddit.com", opts)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    const req = oauth.post(oo, "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "bearer sometkn",
        },
      };
      const n = nock("https://oauth.reddit.com", opts)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.post(oo, "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "bearer sometkn",
        },
      };
      const n = nock("https://oauth.reddit.com", opts)
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
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "bearer sometkn",
      },
    };
    const expectedBody = { api_type: "json", bar: "foo" };
    const n = nock("https://oauth.reddit.com", opts)
      .post("/foo/bar?api_type=json&raw_json=1", expectedBody)
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    await oauth.postJson(oo, "foo/bar", { bar: "foo" }, {});

    n.done();
  });

  it("should give back json data", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "bearer sometkn",
      },
    };
    const n = nock("https://oauth.reddit.com", opts)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const oo = { token: "sometkn", userAgent: "baz" };
    const req = oauth.postJson(oo, "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "bearer sometkn",
        },
      };
      const n = nock("https://oauth.reddit.com", opts)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const oo = { token: "sometkn", userAgent: "baz" };
      const req = oauth.postJson(oo, "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "bearer sometkn",
        },
      };
      const n = nock("https://oauth.reddit.com", opts)
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
