<!-- This README will become the documentation home page. -->

# Snoots @ VERSION_IDENTIFIER

Welcome to the snoots documentation!

Helpful links:

- [GitHub repo](https://github.com/thislooksfun/snoots)
- [More versions](https://thislooks.fun/snoots/docs)
- [Migrating from snoowrap](#migrating-from-snoowrap)

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

If you just want to retrieve information from the Reddit api without controlling
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
async function printTree(cmt: Comment, indent: string = "") {
  const body = cmt.body.replace(/\n/g, "\n" + indent);
  console.log(`${indent}(${cmt.id}) ${cmt.author}: ${body}`);
  for await (const reply of cmt.replies) {
    await printTree(reply, indent + "  ");
  }
}

(async () => {
  const comment = await client.comments.fetch("gqe92yr");
  await printTree(comment);
})();
```

For full project examples check out the [examples directory][exdir]

More examples will come as snoots evolves!

## Migrating from Snoowrap

There are some major differences between snoots and snoowrap. Here are some of
the largest:

1. Objects are not lazy loaded.
1. Promise chaining properties is not allowed.
1. All parameters are camelCase, not snake_case.
1. Listings are not arrays, but they can be iterated using `for await`.
1. Sub-objects are not auto-populated (like `Post` and `Comment`'s `author`). In
   snoowrap the `author` field is a user object, but in snoots it's just a
   string.

What does this mean in practice? Here are some examples:

1. Reading the title of the newest post from r/funny:

   ```ts
   // snoowrap
   const title = await client.getSubreddit("funny").getNew()[0].title;

   // snoots (literal translation)
   const sub = await client.subreddits.fetch("funny");
   const post = await sub.getNewPosts().first();
   const title = post?.title;

   // snoots (preferred method, 1 fewer api call)
   const post = await client.subreddits.getNewPosts("funny").first();
   const title = post?.title;
   ```

1. Listing the authors of the currently hot posts in r/funny:

   ```ts
   // snoowrap
   const posts = await client.getSubreddit("funny").getHot().fetchAll();
   for (const post of posts) {
     console.log(post.author.name);
   }

   // snoots (literal translation)
   const sub = await client.subreddits.fetch("funny");
   const posts = sub.getHotPosts();
   for await (const post of posts) {
     console.log(p.author);
   }

   // snoots (preferred method, 1 fewer api call)
   const posts = client.subreddits.getHotPosts("funny");
   for await (const post of posts) {
     console.log(p.author);
   }
   ```

<!-- Links -->

[cd]: ./classes/Client.html
[ua]: ./interfaces/ClientOptions.html#userAgent
[creds]: ./interfaces/Credentials.html
[exdir]: https://github.com/thislooksfun/snoots/blob/master/examples
