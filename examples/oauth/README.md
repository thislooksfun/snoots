# OAuth Example

This example is a simple OAuth server example using [express][express].

## Getting started

To run this example first [create an application][creds] and set the redirect
URI to `http://127.0.0.1:8080/auth`. Then rename `.env.example` to `.env` and
fill in the values (info on [user agents][ua]). Finally run `npm install` then
`npm run build`. From then simply run `npm start` and navigate your favorite
browser to `localhost:8080/login`.

[express]: https://expressjs.com
[creds]: https://thislooks.fun/snoots/docs/latest/interfaces/Credentials.html
[ua]: https://thislooks.fun/snoots/docs/latest/interfaces/ClientOptions.html#userAgent
