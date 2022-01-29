import nock from "nock";
import * as core from "../../core";

beforeAll(() => nock.disableNetConnect());
afterEach(() => nock.cleanAll());
afterAll(() => {
  nock.restore();
  nock.enableNetConnect();
});

const domain = "https://example.com";
describe("get()", () => {
  it("should pass common values", async () => {
    const opts = { reqheaders: { "user-agent": "baz" } };
    const n = nock(domain, opts)
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    await core.get(domain, "foo/bar", {}, "baz");

    n.done();
  });

  it("should give back json data", async () => {
    const opts = { reqheaders: { "user-agent": "baz" } };
    const n = nock(domain, opts)
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = core.get(domain, "foo/bar", {}, "baz");
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = { reqheaders: { "user-agent": "baz" } };
      const n = nock(domain, opts)
        .get("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = core.get(domain, "foo/bar", {}, "baz");
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = { reqheaders: { "user-agent": "baz" } };
      const n = nock(domain, opts)
        .get("/foo/bar?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const req = core.get(domain, "foo/bar", {}, "baz");
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
    const opts = { reqheaders: { "user-agent": "baz" } };
    const expectedBody = { api_type: "json", bar: "foo" };
    const n = nock(domain, opts)
      .post("/foo/bar?api_type=json&raw_json=1", expectedBody)
      .reply(200, { bim: "bom" });

    await core.post(domain, "foo/bar", { bar: "foo" }, {}, "baz");

    n.done();
  });

  it("should give back json data", async () => {
    const opts = { reqheaders: { "user-agent": "baz" } };
    const n = nock(domain, opts)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = core.post(domain, "foo/bar", { bar: "foo" }, {}, "baz");
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = { reqheaders: { "user-agent": "baz" } };
      const n = nock(domain, opts)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = core.post(domain, "foo/bar", { bar: "foo" }, {}, "baz");
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = { reqheaders: { "user-agent": "baz" } };
      const n = nock(domain, opts)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const req = core.post(domain, "foo/bar", { bar: "foo" }, {}, "baz");
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
    const opts = { reqheaders: { "user-agent": "baz" } };
    const expectedBody = { api_type: "json", bar: "foo" };
    const n = nock(domain, opts)
      .post("/foo/bar?api_type=json&raw_json=1", expectedBody)
      .reply(200, { bim: "bom" });

    await core.postJson(domain, "foo/bar", { bar: "foo" }, {}, "baz");

    n.done();
  });

  it("should give back json data", async () => {
    const opts = { reqheaders: { "user-agent": "baz" } };
    const n = nock(domain, opts)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = core.postJson(domain, "foo/bar", { bar: "foo" }, {}, "baz");
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = { reqheaders: { "user-agent": "baz" } };
      const n = nock(domain, opts)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = core.postJson(domain, "foo/bar", { bar: "foo" }, {}, "baz");
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = { reqheaders: { "user-agent": "baz" } };
      const n = nock(domain, opts)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const req = core.postJson(domain, "foo/bar", { bar: "foo" }, {}, "baz");
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});
