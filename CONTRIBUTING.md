# Contributing to mxRaven JS Plugins

Thanks for taking the time to contribute. This guide covers how to report
issues, propose changes, and get a pull request merged.

## Ways to contribute

- **Report a bug** by opening an issue.
- **Request a feature**, for example a new template engine adapter.
- **Improve documentation** in the READMEs or the TSDoc.
- **Send a pull request** for a fix, feature, or test.

Please be respectful and constructive in issues, reviews, and discussions.

## Reporting bugs

Open an issue with enough detail to reproduce it:

- What you expected to happen and what happened instead.
- The affected package (`@mxraven/react`, `@mxraven/vue`, ...) and its version.
- The `@mxraven/mail` version, the Node.js version, and the framework version.
- A minimal snippet or steps to reproduce.
- The full error output.

## Suggesting features

Open an issue describing the problem you are trying to solve, the API you would
like to use, and any alternatives you considered. Small, focused proposals are
easier to review than broad ones.

## Development setup

1. Install Node.js 20.19 or newer and pnpm (`corepack enable`).
2. Fork the repository and clone your fork.
3. Create a branch with a descriptive name, for example:
   `git checkout -b feat/svelte-renderer`.

### Repository layout

| Path                   | Contents                           |
| ---------------------- | ---------------------------------- |
| `packages/react/`      | `@mxraven/react`: React adapter.   |
| `packages/vue/`        | `@mxraven/vue`: Vue adapter.       |
| `packages/handlebars/` | `@mxraven/handlebars`: Handlebars. |
| `packages/*/src`       | Sources and co-located tests.      |
| `packages/*/dist`      | Build output (not committed).      |

## Build and test

```sh
pnpm install
pnpm run check   # format, lint, typecheck, test, build
pnpm run test    # vitest across packages
```

## Adding a template engine

Each adapter is a factory that returns a `TemplateRenderer` from
`@mxraven/mail`:

- Keep `@mxraven/mail` type-only: peer dependency plus a concrete dev
  dependency.
- Keep the engine framework (`react`/`react-dom`, `vue`, ...) a peer so
  consumers never get duplicates.
- Add the engine's render library as a real dependency.
- Document the factory with TSDoc (`@public`) and cover its output with tests.
- Record a changeset (`pnpm run changeset`) for the first release.

## Coding guidelines

- **Keep changes focused.** One concern per pull request.
- **Add tests.** Every behavior change or bug fix should come with a test.
- **Document public API.** Exported symbols need TSDoc with `@public`.
- **Follow the existing code style.** ESM only, `.js` extensions on relative
  imports, named exports, no `any`.
- **Never commit secrets.** No tokens, keys, credentials, or personal data.

## Commit messages

Use a type prefix so the history stays readable:

| Prefix     | Use for                                                 |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation only                                      |
| `test`     | Tests                                                   |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `build`    | Build system or dependencies                            |
| `ci`       | CI configuration                                        |
| `chore`    | Maintenance tasks                                       |

Where it helps, add a scope, for example `feat(react): ...`.

## Pull requests

Before opening a pull request, confirm:

- [ ] `pnpm run check` passes.
- [ ] New behavior is covered by tests.
- [ ] Public API changes are documented with TSDoc.
- [ ] The change is focused on a single concern.
- [ ] A changeset is included for user-visible changes.

In the description, explain what the change does and why, and link the related
issue. A maintainer will review and may request changes; please be responsive to
feedback.

## Releases

Releases are managed with [Changesets](https://github.com/changesets/changesets).
Add a changeset with `pnpm run changeset`; merging the generated
`chore: release` pull request publishes the affected packages to npm with
provenance.

## License

By contributing, you agree that your contributions are licensed under the
[Apache License 2.0](./LICENSE), and you confirm you have the right to submit
them.
