<!-- This README will become the documentation home page. -->

# Snoots @ {{version}}

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
async function printTree(c: Comment, indent: string = "") {
  const body = c.body.replace(/\n/g, "\n" + indent);
  console.log(`${indent}(${c.id}) ${c.author}: ${body}`);
  await c.replies.each(r => printTree(r, indent + "  "));
}

(async () => {
  const comment = await client.comments.fetch("gqe92yr");
  await printTree(comment);
})();
```

More examples will come as snoots evolves!

## Migrating from Snoowrap

There are some major differences between snoots and snoowrap. Here are some of
the largest:

1. Objects are not lazy loaded.
1. Promise chaining properties is not allowed.
1. All parameters are camelCase, not snake_case.
1. Listings are not arrays. Instead use [.each()][l-each] to iterate through a
   listing.
1. Sub-objects are not auto-populated (like `Post` and `Comment`'s `author`). In
   snoowrap the `author` field is a user object, but in snoots it's just a
   username.

What does this mean in practice? Here are some examples:

```ts
// snoowrap
client.getSubreddit("funny").getRandomSubmission().title; // Promise<string>

// snoots (literal translation)
const sub = await client.subreddits.fetch("funny");
const post = await sub.getRandomPost();
const title = post.title;

// snoots (preferred method, 1 fewer api call)
const post = await client.subreddits.getRandomPost("funny");
const title = post.title;
```

```ts
// snoowrap
const posts = await client.getSubreddit("funny").getNew().fetchAll();
posts.map(p => console.log(p.author.name));

// snoots (literal translation)
const sub = await client.subreddits.fetch("funny");
const posts = sub.getNewPosts();
await posts.each(p => console.log(p.author));

// snoots (preferred method, 1 fewer api call)
const posts = client.subreddits.getNewPosts("funny");
await posts.each(p => console.log(p.author));
```

### Listings

[Listings][listing] in snoots are _not_ iterables. This is by design. Reddit's
listings come in many forms, ranging from fully-populated arrays to completely
empty lists with instructions on where to look for more items. Trying to expose
this as an array or other iterable leaves only two options: fetch the entirety
of every listing before giving it back to you, or make you responsible for
fetching more. Both solutions suck. In the former case you are forced to deal
with dozens or even hundreds of extra api calls that eat up your ratelimit, and
in the latter it's really easy to forget to fetch more and make your code run
perfectly but skip most of the items.

Rather than deal with all this mess, snoots' Listing class is an opqaue wrapper
around the implementation details of the actual data population, instead only
exposing clean, easy to understand methods to interact with the data as a whole.
The main way you'll likely interact with a Listing is via the [.each()][l-each]
method. If you want to run your logic on a whole page at a time you can use
[.eachPage()][l-eachpage]. Both of these take in functions that allow for early
breaking of the loop. If the callback returns or resolves to (returns a Promise
that then becomes) `false`, the iteration will be stopped and no more fetching
will occur. For example, to print out all the comments on a post until one of
them is too old, you can use the following:

```ts
const post = await client.posts.fetch("<post id>");
const timestamp = some old timestamp;
await post.comments.each(c => {
  console.log(c.body);
  return c.createdUtc > timestamp;
});
```

There are times when you only need to know if _something_ matches some criteria
in a Listing. For that we have [.some()][l-some]. This behaves just like the
array method of the same name, except that it is fully asynchronous.

```ts
const post = await client.posts.fetch("<post id>");
const autoModDidComment = await post.comments.some(c => c.author === "AutoModerator"));
```

<!-- Links -->

[cd]: ./classes/client.html
[ua]: ./interfaces/clientoptions.html#useragent
[creds]: ./interfaces/credentials.html
[listing]: https://thislooks.fun/snoots/docs/latest/classes/listing.html
[l-each]: https://thislooks.fun/snoots/docs/latest/classes/listing.html#each
[l-eachpage]: https://thislooks.fun/snoots/docs/latest/classes/listing.html#eachpage
[l-some]: https://thislooks.fun/snoots/docs/latest/classes/listing.html#some
