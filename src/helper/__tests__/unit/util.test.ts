import * as util from "../../util";

describe("fromRedditData()", () => {
  it("should convert keys to camel case", () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const a = { foo_bar: "a", bar_foo: "b" };
    const b = { fooBar: "a", barFoo: "b" };

    expect(util.fromRedditData(a)).toStrictEqual(b);
  });

  it("should preserve camel cased keys", () => {
    const a = { fooBar: "a", barFoo: "b" };
    const b = { fooBar: "a", barFoo: "b" };

    expect(util.fromRedditData(a)).toStrictEqual(b);
  });

  it("should replace null with undefined", () => {
    // eslint-disable-next-line unicorn/no-null
    const a = { fooBar: null, barFoo: undefined };
    const b = { fooBar: undefined, barFoo: undefined };

    expect(util.fromRedditData(a)).toStrictEqual(b);
  });
});
