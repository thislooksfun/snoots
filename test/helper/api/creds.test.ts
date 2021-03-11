import nock from "nock";
import * as creds from "../../../src/helper/api/creds";

afterEach(() => nock.cleanAll());
afterAll(() => nock.restore());

describe("get()", () => {
  it("should pass common values", async () => {
    const n = nock("https://www.reddit.com")
      .get("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    await creds.get(c, "baz", "foo/bar", {});

    // TODO: Add tests for user agent and auth.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://www.reddit.com")
      .get("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    const req = creds.get(c, "baz", "foo/bar", {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://www.reddit.com")
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.get(c, "baz", "foo/bar", {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock("https://www.reddit.com")
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.get(c, "baz", "foo/bar", {});
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
    const n = nock("https://www.reddit.com")
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    await creds.post(c, "baz", "foo/bar", { bar: "foo" }, {});

    // TODO: Add tests for body, user agent, and auth.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://www.reddit.com")
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    const req = creds.post(c, "baz", "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://www.reddit.com")
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.post(c, "baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock("https://www.reddit.com")
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.post(c, "baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});

describe("postForm()", () => {
  it("should pass common values", async () => {
    const n = nock("https://www.reddit.com")
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    await creds.postForm(c, "baz", "foo/bar", { bar: "foo" }, {});

    // TODO: Add tests for body, user agent, and auth.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://www.reddit.com")
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    const req = creds.postForm(c, "baz", "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://www.reddit.com")
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.postForm(c, "baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock("https://www.reddit.com")
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.postForm(c, "baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});
