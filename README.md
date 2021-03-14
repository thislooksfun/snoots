# snoots

<p align="center">
  <a href="https://github.com/semantic-release/semantic-release"
    ><img
      alt="semantic release"
      src="https://flat.badgen.net/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80/semantic%20release/e10079"
    /></a
  >
  <a href="https://github.com/thislooksfun/snoots/releases/latest"
    ><img
      alt="latest release"
      src="https://flat.badgen.net/github/release/thislooksfun/snoots"
    /></a
  >
  <a href="https://github.com/thislooksfun/snoots/releases"
    ><img
      alt="latest stable release"
      src="https://flat.badgen.net/github/release/thislooksfun/snoots/stable"
    /></a
  >
  <a href="#"
    ><img
      alt="checks status"
      src="https://flat.badgen.net/github/checks/thislooksfun/snoots"
    /></a
  >
  <a href="https://github.com/thislooksfun/snoots/blob/master/LICENSE"
    ><img
      alt="license"
      src="https://flat.badgen.net/github/license/thislooksfun/snoots"
    /></a
  >
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/snoots?activeTab=versions"
    ><img
      alt="npm version"
      src="https://flat.badgen.net/npm/v/snoots"
    /></a
  >
  <a href="https://github.com/thislooksfun/snoots/tree/master/types"
    ><img
      alt="npm types"
      src="https://flat.badgen.net/npm/types/snoots"
    /></a
  >
  <a href="https://www.npmjs.com/package/snoots"
    ><img
      alt="weekly npm downloads"
      src="https://flat.badgen.net/npm/dw/snoots"
    /></a
  >
  <a href="https://www.npmjs.com/package/snoots?activeTab=dependents"
    ><img
      alt="npm dependents"
      src="https://flat.badgen.net/npm/dependents/snoots"
    /></a
  >
</p>

A modern, fully-featured, strongly-typed reddit api.

# WARNING

This project is in early alpha. Things can (and likely will) change at any time
for any reason, and large parts of the api are not yet supported. If you need a
stable reddit api today, use [snoowrap][sw].

If you want to help guide the future of the project towards v1.0.0, please check
out [this discussion](https://github.com/thislooksfun/snoots/discussions/4)!

## Installation

```sh
npm i snoots@dev
```

Note: Node 14+ is required.

## Examples

Print a comment tree to stdout.

```ts
async function printChain(c: Comment, indent: string = "") {
  const body = c.body.replace(/\n/g, "\n" + indent);
  console.log(`${indent}(${c.id}) ${c.author}: ${body}`);
  await c.replies.each(r => printChain(r, indent + "  "));
}

(async () => {
  const comment = await client.comments.fetch("gqe92yr");
  await printChain(comment);
})();
```

More examples will come as snoots evolves!

# Contributing

If you want to help out, please read the [CONTRIBUTING.md][c.md].

<!-- Links -->

[sw]: https://github.com/not-an-aardvark/snoowrap
[c.md]: https://github.com/thislooksfun/snoots/blob/master/CONTRIBUTING.md
