import * as util from "../../src/helper/util";

describe("camelCaseKeys()", () => {
  it("should convert keys to camel case", () => {
    const a = { foo_bar: "a", bar_foo: "b" };
    const b = { fooBar: "a", barFoo: "b" };

    expect(util.camelCaseKeys(a)).toStrictEqual(b);
  });

  it("should preserve camel cased keys", () => {
    const a = { fooBar: "a", barFoo: "b" };
    const b = { fooBar: "a", barFoo: "b" };

    expect(util.camelCaseKeys(a)).toStrictEqual(b);
  });
});
