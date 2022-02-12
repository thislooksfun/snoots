## [1.0.0-dev.16](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.15...v1.0.0-dev.16) (2022-02-12)


### Features

* add optional debugging via the `debug` module ([fbb7bb3](https://github.com/thislooksfun/snoots/commit/fbb7bb31086d72c87c2c967a2bf58e3b8058ab81))

## [1.0.0-dev.15](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.14...v1.0.0-dev.15) (2022-02-04)


### ⚠ BREAKING CHANGES

* `Post.thumbnailHeight` and `Post.thumbnailWidth` have
been temporarily removed. They were not yet supposed to be exposed, but
they slipped through the cracks.
* There is no longer a default export. If you are using
TypeScript or ESM switch from using `import Client from "snoots"` to
using `import { Client } from "snoots"`. If you are using CommonJS
switch from `const Client = require("snoots")` to
`const { Client } = require("snoots")`, or to
`const Client = require("snoots").Client`.
* All internal usages of `null` have been replaced with
`undefined`. This includes mapping `null` to `undefined` in Reddit's API
responses. If you were checking any values for existence with `=== null`
you should replace that check with `=== undefined` (or `== null` or
`== undefined`).
* `Client.authFromCode()` has been replaced with
`Client.fromAuthCode()`.
* `Client.getAuthUrl()` has been renamed to
`Client.makeAuthUrl()`.

### Features

* **docs:** update typedoc to 0.22 ([a8260d7](https://github.com/thislooksfun/snoots/commit/a8260d7af94a20fad608beb3317d9f4999f178a6))
* move all Reddit REST api interaction into new Gateway classes ([8c0856a](https://github.com/thislooksfun/snoots/commit/8c0856a1d1098e8d49794fecdee1f300d6ed3ff4))
* remove default export ([3df8d41](https://github.com/thislooksfun/snoots/commit/3df8d41a26b3f5d8f0bb59e55d9bcb44d86a3f35))
* rename Client.getAuthUrl() -> Client.makeAuthUrl() ([ba87fdf](https://github.com/thislooksfun/snoots/commit/ba87fdfe1b5d9d300f140c1bb2a785b79e4565f8))
* replace `null` with `undefined` ([5ab17b6](https://github.com/thislooksfun/snoots/commit/5ab17b61bb1051e7d6205eccbfc8facf10cc3121))
* replace Client.authFromCode() with Client.fromAuthCode() ([8fa90b8](https://github.com/thislooksfun/snoots/commit/8fa90b810461dd739b10d51dcdad947424a571af))


### Bug Fixes

* export Replyable ([8fc0ddf](https://github.com/thislooksfun/snoots/commit/8fc0ddf3e028c082f3ace118ff412e41614e4b09))
* remove unused properties ([17a5f36](https://github.com/thislooksfun/snoots/commit/17a5f3624ddde7ac0e88db585319154947492b97))
* update camelcase to 6.3.0 ([72ee276](https://github.com/thislooksfun/snoots/commit/72ee276c793def28fd36e3710a5c31d8aad1af0a))
* update got to 11.8.3 ([2ba1587](https://github.com/thislooksfun/snoots/commit/2ba15872c4470e2b91830d70c606296c0f785b1b))
* update tslib to 2.3.1 ([076e4ab](https://github.com/thislooksfun/snoots/commit/076e4ab4e3245bfad6df3aedf4081a88496c2138))

## [1.0.0-dev.14](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.13...v1.0.0-dev.14) (2021-05-29)


### Bug Fixes

* populate Post.removed when missing ([#32](https://github.com/thislooksfun/snoots/issues/32)) ([4c7ba39](https://github.com/thislooksfun/snoots/commit/4c7ba394b4c84e942879d26421c405bff9640966))

## [1.0.0-dev.13](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.12...v1.0.0-dev.13) (2021-05-14)


### Bug Fixes

* make empty listings actually empty ([f8467ca](https://github.com/thislooksfun/snoots/commit/f8467ca2d8f1f12e80daf5ff0c30202eba44a48f))

## [1.0.0-dev.12](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.11...v1.0.0-dev.12) (2021-05-14)


### Features

* add a helper to get the first item from a Listing ([61e8e35](https://github.com/thislooksfun/snoots/commit/61e8e35b99a05a590101262ba276b704afa5b915))


### Bug Fixes

* add a default sort to User(Controls).getPosts() ([7a20a03](https://github.com/thislooksfun/snoots/commit/7a20a03194756955562f05e3fd5e7eeff63ad39f))

## [1.0.0-dev.11](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.10...v1.0.0-dev.11) (2021-05-14)


### Features

* add initial support for interacting with users ([bd0fc8b](https://github.com/thislooksfun/snoots/commit/bd0fc8b01140aaab1b0b47eb6cdedb96a79c2b22))

## [1.0.0-dev.10](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.9...v1.0.0-dev.10) (2021-04-14)


### Performance Improvements

* fetch extra comments one page at a time ([d80b32a](https://github.com/thislooksfun/snoots/commit/d80b32a1079a0d5fed18d19102168c7167099e5d))

## [1.0.0-dev.9](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.8...v1.0.0-dev.9) (2021-04-13)


### ⚠ BREAKING CHANGES

* This renames Listing.each to Listing.forEach, and
it is now no longer the preferred method of iteration. Instead you
should probably use `for await` loops.

### Features

* make Listings iterable ([868d58d](https://github.com/thislooksfun/snoots/commit/868d58d06d5a38dd94e7d293d722d89f649e8b53))

## [1.0.0-dev.8](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.7...v1.0.0-dev.8) (2021-04-13)


### Bug Fixes

* use the correct kind of Comment ([6e88c7e](https://github.com/thislooksfun/snoots/commit/6e88c7efe6eb4cbc46ea0e7980c64a0dc6739530))

## [1.0.0-dev.7](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.6...v1.0.0-dev.7) (2021-04-12)


### Bug Fixes

* make tslib a runtime dependency ([239a415](https://github.com/thislooksfun/snoots/commit/239a4152a87525b1b5a72e17e0fcc6cc4c075934))

## [1.0.0-dev.6](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.5...v1.0.0-dev.6) (2021-04-12)


### Features

* add getters for moderation listings ([1c3876e](https://github.com/thislooksfun/snoots/commit/1c3876e56cc5b8816354392f8e7bbdf601ee272f))


### Bug Fixes

* export Subreddit ([1f6041d](https://github.com/thislooksfun/snoots/commit/1f6041da5bf1f36c68a14bc4419740d767ef2619))

## [1.0.0-dev.5](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.4...v1.0.0-dev.5) (2021-04-09)


### Features

* add a method to (re)authorize a client ([d86550d](https://github.com/thislooksfun/snoots/commit/d86550d0e7aef8cfbdaa8333d45207119cf9c2e5))
* add a way to get the refresh token ([e55b9e2](https://github.com/thislooksfun/snoots/commit/e55b9e2088b780d7b05fb5ac1360a7616b980741))
* add OAuth flow ([7029a16](https://github.com/thislooksfun/snoots/commit/7029a16f3c0cf1af2face6baf8b9c0e1423606c5))

## [1.0.0-dev.4](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.3...v1.0.0-dev.4) (2021-04-08)


### Features

* add a helper function for crossposting ([19b7fc5](https://github.com/thislooksfun/snoots/commit/19b7fc57a76fb38047bd1f749560476d88a47f99))
* add a way to search posts ([00c48ec](https://github.com/thislooksfun/snoots/commit/00c48ec7747f555dbc00065f5854e0cbf5dc82e3))
* add blockAuthor() ([58feff1](https://github.com/thislooksfun/snoots/commit/58feff1f1ab3962a009c44efae8334805c9c4ccf))
* add initial support for Subreddits ([b5f09ea](https://github.com/thislooksfun/snoots/commit/b5f09eafa1b1a3840a6d6b6864b82528a9c1893e))

## [1.0.0-dev.3](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.2...v1.0.0-dev.3) (2021-03-26)


### Features

* add a function to approve an item ([11cde28](https://github.com/thislooksfun/snoots/commit/11cde2862bd4c7dd27f80ba18776ceae9e86e159))
* add a helper to check if any items match ([3f9403d](https://github.com/thislooksfun/snoots/commit/3f9403d3ad50b426bb8d817a3803ec9fa5072fb7))
* add a way to execute a function on each page of a listing ([313c4af](https://github.com/thislooksfun/snoots/commit/313c4af73b1a1147dc0393afbc63d310d7f8b377))
* add a way to reply to content ([f5cbf7e](https://github.com/thislooksfun/snoots/commit/f5cbf7e79fa9d929f6ca72082bf4c2e51c126cd9))
* add partial support for Posts ([808df45](https://github.com/thislooksfun/snoots/commit/808df45279f6c5e3c5201a06c933c885b891c09e))


### Bug Fixes

* batch comments 75 at a time ([d3cad93](https://github.com/thislooksfun/snoots/commit/d3cad93f1b7fa0bf66dc46ebfc07d81ac6f7ad08))
* mark the 'approved' boolean as optional ([0d71a50](https://github.com/thislooksfun/snoots/commit/0d71a5012b33b0b71e0de16e60ef943664ebad65))

## [1.0.0-dev.2](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.1...v1.0.0-dev.2) (2021-03-14)


### Bug Fixes

* store and use the given refresh token ([47be0af](https://github.com/thislooksfun/snoots/commit/47be0af384f08769a620bad8b65476a41360165b))

## 1.0.0-dev.1 (2021-03-14)


### Features

* the initial (dev) release!
