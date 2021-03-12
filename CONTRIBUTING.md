# Contributing

You want to help? Awesome!

## Getting Started

To get started with local development, do the following:

```sh
# Clone the repo.
git clone https://github.com/thislooksfun/snoots
# Move into the folder.
cd snoots
# Install the dependencies as they are.
npm ci
```

## Code style

This project uses [Prettier][prettier]. If you installed using the instructions
above your changes will be automatically linted when you commit them. If you
want to manually check your formatting you can run `npm run lint`.

## Commit messages

Since this project uses [semantic-release][semrel] we need the commit messages
to be machine readable (we use the [config-conventional][cc] preset). If you
installed using the instructions above your commit messages will be
automatically linted.

# Testing

When making a change, please add/update the relevant test(s) so we can have good
testing! To run all the tests run `npm test`. To only run a subset of tests
during development you can use `npm test <pattern>`.

<!-- Links -->

[prettier]: https://prettier.io
[semrel]: https://github.com/semantic-release/semantic-release
[cc]: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
