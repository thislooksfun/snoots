import nock from "nock";
import * as anon from "../../../../src/helper/api/anon";

afterEach(() => nock.cleanAll());
afterAll(() => nock.restore());

describe("get()", () => {
  it("should pass common values", async () => {
    const n = nock("https://www.reddit.com")
      .get("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    await anon.get("baz", "foo/bar", {});

    // TODO: Add tests for user agent.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://www.reddit.com")
      .get("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = anon.get("baz", "foo/bar", {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://www.reddit.com")
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = anon.get("baz", "foo/bar", {});
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

      const req = anon.get("baz", "foo/bar", {});
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

    await anon.post("baz", "foo/bar", { bar: "foo" }, {});

    // TODO: Add tests for body and user agent.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://www.reddit.com")
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = anon.post("baz", "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://www.reddit.com")
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = anon.post("baz", "foo/bar", { bar: "foo" }, {});
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

      const req = anon.post("baz", "foo/bar", { bar: "foo" }, {});
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
    const n = nock("https://www.reddit.com")
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    await anon.postJson("baz", "foo/bar", { bar: "foo" }, {});

    // TODO: Add tests for body and user agent.
    // BODY: Pending https://github.com/nock/nock/issues/2171.
    n.done();
  });

  it("should give back json data", async () => {
    const n = nock("https://www.reddit.com")
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const req = anon.postJson("baz", "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const n = nock("https://www.reddit.com")
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const req = anon.postJson("baz", "foo/bar", { bar: "foo" }, {});
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

      const req = anon.postJson("baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});
