import nock from "nock";
import * as creds from "../../creds";

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
        authorization: "Basic Y2lkOmNzZWM=",
      },
    };
    const n = nock("https://www.reddit.com", opts)
      .get("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    await creds.get(c, "baz", "foo/bar", {});

    n.done();
  });

  it("should give back json data", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "Basic Y2lkOmNzZWM=",
      },
    };
    const n = nock("https://www.reddit.com", opts)
      .get("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    const req = creds.get(c, "baz", "foo/bar", {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "Basic Y2lkOmNzZWM=",
        },
      };
      const n = nock("https://www.reddit.com", opts)
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.get(c, "baz", "foo/bar", {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "Basic Y2lkOmNzZWM=",
        },
      };
      const n = nock("https://www.reddit.com", opts)
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
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "Basic Y2lkOmNzZWM=",
      },
    };
    const expectedBody = { api_type: "json", bar: "foo" };
    const n = nock("https://www.reddit.com", opts)
      .post("/foo/bar.json?api_type=json&raw_json=1", expectedBody)
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    await creds.post(c, "baz", "foo/bar", { bar: "foo" }, {});

    n.done();
  });

  it("should give back json data", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "Basic Y2lkOmNzZWM=",
      },
    };
    const n = nock("https://www.reddit.com", opts)
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    const req = creds.post(c, "baz", "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "Basic Y2lkOmNzZWM=",
        },
      };
      const n = nock("https://www.reddit.com", opts)
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.post(c, "baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "Basic Y2lkOmNzZWM=",
        },
      };
      const n = nock("https://www.reddit.com", opts)
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

describe("postJson()", () => {
  it("should pass common values", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "Basic Y2lkOmNzZWM=",
      },
    };
    const expectedBody = { api_type: "json", bar: "foo" };
    const n = nock("https://www.reddit.com", opts)
      .post("/foo/bar.json?api_type=json&raw_json=1", expectedBody)
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    await creds.postJson(c, "baz", "foo/bar", { bar: "foo" }, {});

    n.done();
  });

  it("should give back json data", async () => {
    const opts = {
      reqheaders: {
        "user-agent": "baz",
        authorization: "Basic Y2lkOmNzZWM=",
      },
    };
    const n = nock("https://www.reddit.com", opts)
      .post("/foo/bar.json?api_type=json&raw_json=1")
      .reply(200, { bim: "bom" });

    const c = { clientId: "cid", clientSecret: "csec" };
    const req = creds.postJson(c, "baz", "foo/bar", { bar: "foo" }, {});
    await expect(req).resolves.toStrictEqual({ bim: "bom" });

    n.done();
  });

  describe("when given an api error", () => {
    it("should throw", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "Basic Y2lkOmNzZWM=",
        },
      };
      const n = nock("https://www.reddit.com", opts)
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { error: "whoops" });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.postJson(c, "baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error("Reddit returned an error: whoops");
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });

    it("should use the description if available", async () => {
      const opts = {
        reqheaders: {
          "user-agent": "baz",
          authorization: "Basic Y2lkOmNzZWM=",
        },
      };
      const n = nock("https://www.reddit.com", opts)
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, {
          error: "whoops",
          error_description: "something went wrong :(",
        });

      const c = { clientId: "cid", clientSecret: "csec" };
      const req = creds.postJson(c, "baz", "foo/bar", { bar: "foo" }, {});
      const err = new Error(
        "Reddit returned an error: whoops: something went wrong :("
      );
      await expect(req).rejects.toStrictEqual(err);

      n.done();
    });
  });
});
