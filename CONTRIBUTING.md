# Contributing

You want to help? Awesome!

## Getting Started

To get started with local development, do the following:

```sh
# Clone the repo.
git clone https://github.com/thislooksfun/snoots
# Move into the folder.
cd snoots
# Install dependencies.
npm install
```

## Code style

This project uses [Prettier][prettier] and [ESLint][eslint] to automatically
enforce style. To check style manually, run `npm run lint`.

## Commit messages

Since this project uses [semantic-release][semrel] we need the commit messages
to be machine readable. To achieve this we use the [config-conventional][cc]
preset.

Please note that because we auto-generate the changelog from the commits, the
commit types must be from the perspective of the public API. For example, adding
a new internal method is a `chore:`, not a `feat:`, since the external API does
not change. _Using_ that new internal method to provide a new public feature
_is_ a `feat:`.

# Testing

When making a change, please add/update the relevant test(s) so we can have good
testing! To run all the tests run `npm test`. To only run a subset of tests
during development you can use `npm test <pattern>`.

There are two types of tests: unit and end-to-end (e2e). Unit tests run entirely
locally (no external API requests), and test functionality such as parsing.
End-to-end tests query the Reddit API directly to check that we interface with
it correctly. We currently _do not
have any e2e tests_ because of problems getting them to run reliably (see #11).
Any PRs adding e2e tests **_will be rejected_** until we find a suitable
resolution to #11.

<!-- Links -->

[eslint]: https://eslint.org
[prettier]: https://prettier.io
[semrel]: https://github.com/semantic-release/semantic-release
[cc]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
