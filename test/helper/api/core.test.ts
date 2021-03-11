import nock from "nock";
import * as core from "../../../src/helper/api/core";

afterEach(() => nock.cleanAll());
afterAll(() => nock.restore());

const domain = "https://example.com";
describe("get()", () => {
  it("should pass common values", async () => {
    const n = nock(domain)
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    await core.get(domain, "foo/bar", {}, "baz");

    // TODO: Add tests for user agent.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock(domain)
      .get("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = core.get(domain, "foo/bar", {}, "baz");
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock(domain)
        .get("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = core.get(domain, "foo/bar", {}, "baz");
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock(domain)
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
    const n = nock(domain)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    await core.post(domain, "foo/bar", { bar: "foo" }, {}, "baz");

    // TODO: Add tests for body and user agent.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock(domain)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = core.post(domain, "foo/bar", { bar: "foo" }, {}, "baz");
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock(domain)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = core.post(domain, "foo/bar", { bar: "foo" }, {}, "baz");
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock(domain)
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

describe("postForm()", () => {
  it("should pass common values", async () => {
    const n = nock(domain)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    await core.postForm(domain, "foo/bar", { bar: "foo" }, {}, "baz");

    // TODO: Add tests for body and user agent.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock(domain)
      .post("/foo/bar?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = core.postForm(domain, "foo/bar", { bar: "foo" }, {}, "baz");
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock(domain)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = core.postForm(domain, "foo/bar", { bar: "foo" }, {}, "baz");
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const n = nock(domain)
        .post("/foo/bar?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const req = core.postForm(domain, "foo/bar", { bar: "foo" }, {}, "baz");
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});
