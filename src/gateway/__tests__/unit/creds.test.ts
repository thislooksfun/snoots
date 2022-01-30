import nock from "nock";

import { CredsGateway } from "../../creds";

let gateway: CredsGateway;

beforeAll(() => {
  nock.disableNetConnect();

  const creds = { clientId: "cid", clientSecret: "csec" };
  gateway = new CredsGateway(creds, "fake-user-agent");
});

afterEach(() => nock.cleanAll());

afterAll(() => {
  nock.restore();
  nock.enableNetConnect();
});

const commonNockOptions = {
  reqheaders: {
    "user-agent": "fake-user-agent",
    authorization: "Basic Y2lkOmNzZWM=",
  },
};

describe("CredsGateway", () => {
  describe(".get()", () => {
    it("should pass common values", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      await gateway.get("foo/bar", {});

      n.done();
    });

    it("should give back json data", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      const req = gateway.get("foo/bar", {});
      await expect(req).resolves.toStrictEqual({ bim: "bom" });

      n.done();
    });

    describe("when given an api error", () => {
      it("should throw", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .get("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, { error: "whoops" });

        const req = gateway.get("foo/bar", {});
        const err = new Error("Reddit returned an error: whoops");
        await expect(req).rejects.toStrictEqual(err);

        n.done();
      });

      it("should use the description if available", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .get("/foo/bar.json?api_type=json&raw_json=1")
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
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1", expectedBody)
        .reply(200, { bim: "bom" });

      await gateway.post("foo/bar", { bar: "foo" }, {});

      n.done();
    });

    it("should give back json data", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      const req = gateway.post("foo/bar", { bar: "foo" }, {});
      await expect(req).resolves.toStrictEqual({ bim: "bom" });

      n.done();
    });

    describe("when given an api error", () => {
      it("should throw", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, { error: "whoops" });

        const req = gateway.post("foo/bar", { bar: "foo" }, {});
        const err = new Error("Reddit returned an error: whoops");
        await expect(req).rejects.toStrictEqual(err);

        n.done();
      });

      it("should use the description if available", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
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
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1", expectedBody)
        .reply(200, { bim: "bom" });

      await gateway.postJson("foo/bar", { bar: "foo" }, {});

      n.done();
    });

    it("should give back json data", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      const req = gateway.postJson("foo/bar", { bar: "foo" }, {});
      await expect(req).resolves.toStrictEqual({ bim: "bom" });

      n.done();
    });

    describe("when given an api error", () => {
      it("should throw", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, { error: "whoops" });

        const req = gateway.postJson("foo/bar", { bar: "foo" }, {});
        const err = new Error("Reddit returned an error: whoops");
        await expect(req).rejects.toStrictEqual(err);

        n.done();
      });

      it("should use the description if available", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
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
