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

describe("group()", () => {
  it("should split an array into groups", () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const b = [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ];

    expect(util.group(a, 2)).toStrictEqual(b);
  });

  it("should put the remainder into a group", () => {
    const a = [1, 2, 3, 4, 5];
    const b = [
      [1, 2, 3],
      [4, 5],
    ];

    expect(util.group(a, 3)).toStrictEqual(b);
  });
});
