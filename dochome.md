<!-- This README will become the documentation home page. -->

# Snoots @ {{version}}

Welcome to the snoots documentation!

Helpful links:

- [repo](https://github.com/thislooksfun/snoots)
- [more versions](https://thislooks.fun/snoots/docs)
- [getting started](#getting-started)

---

# Getting Started

## User Bots

To get started making a bot with snoots:

1. [Create an application][creds]
1. Come up with a user agent. See [here][ua] for more info.
1. Create a new [Client][cd] instance.
   ```ts
   const client = new Client({
     userAgent: "<the user agent>",
     creds: {
       clientId: "<the client id>",
       clientSecret: "<the client secret>",
     },
     auth: {
       username: "<the reddit account username>",
       password: "<the reddit account password>",
     },
   });
   ```
1. Use the api! If you need some help, check out the [examples](#examples).

## Crawler / Scraper

If you just want to retreive information from the Reddit api without controlling
a user account you can do that!

1. [Create an application][creds]<sup>1</sup>
1. Come up with a user agent. See [here][ua] for more info
1. Create a new [Client][cd] instance.
   ```ts
   const client = new Client({
     userAgent: "<the user agent>",
     creds: {
       clientId: "<the client id>",
       clientSecret: "<the client secret>",
     },
   });
   ```
1. Use the api! If you need some help, check out the [examples](#examples).

<sup>1</sup> If you _really_ don't want to make an application you can skip this
step and leave off the `creds` parameter, but note that performing requests
without an application means you have a _much_ lower ratelimit.

# Examples

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

<!-- Links -->

[cd]: https://thislooks.fun/snoots/docs/latest/classes/client
[ua]: https://thislooks.fun/snoots/interfaces/clientoptions#useragent
[creds]: https://thislooks.fun/snoots/interfaces/credentials
