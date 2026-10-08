# AGENTS.md

## Project

`mxraven-js-plugins` is the plugin monorepo for the mxRaven TypeScript SDK. It
publishes small adapter packages that implement the `TemplateRenderer` contract
exported by `@mxraven/mail` (see `synqronlabs/mxraven-js`).

Each plugin turns an engine-specific input — a React element, a Vue node —
into `{ html, text?, subject? }`. The core SDK and this repo are
deliberately decoupled: plugins import only types from `@mxraven/mail`, so the
core stays zero-dependency and can be released independently.

## Packages

- `packages/react` → `@mxraven/react` (React via `@react-email/render`)
- `packages/vue` → `@mxraven/vue` (Vue via `@vue-email/render`)

`packages/react` and `packages/vue` are implemented. The first task for any new
adapter is to replace its throwing factory stub with the real renderer
implementation and add tests.

## Per-package conventions

- Import core types type-only: `import type { TemplateRenderer } from "@mxraven/mail"`.
- The contract ships in `@mxraven/mail@0.2.2`; the manifests target `^0.2.2`.
- `@mxraven/mail` is a **peer dependency** with a broad range (`>=0.2.2 <1`) and a
  concrete **dev dependency** for types, build, and tests.
- Engine framework stays a peer so consumers never get duplicates:
  `react`/`react-dom`, `vue`.
- The engine's render library is a real dependency of the plugin:
  `@react-email/render`, `@vue-email/render`.
- Every package builds dual ESM + CJS with declarations via the shared
  `tsdown.config.ts`, and publishes with provenance (`publishConfig`).
- Public API is one factory function per package, e.g. `react()`, `vue()`.
  Document it with TSDoc (`@public`) like the core repo does.

## Plugin contract

```ts
import type { TemplateRenderer } from "@mxraven/mail";

export function react(): TemplateRenderer<ReactElement> {
  return {
    async render(element) {
      /* ... */
    },
  };
}
```

`html` is required. `text` and `subject` are optional; a renderer that can
produce text should, because HTML-only mail loses the `multipart/alternative`
deliverability benefit. The `Message.render(renderer, input)` precedence rules
are documented in the core README and must not be re-implemented here.

## Commands

```sh
pnpm install        # install all workspace dependencies
pnpm run check      # format:check + lint + typecheck + test + build
pnpm run build      # pnpm -r build
pnpm run typecheck  # pnpm -r typecheck
pnpm run test       # vitest across packages
pnpm run changeset  # record a release note
```

Add a regression test for every behavior; test the renderer output and, where
practical, the integration through `new Message().render(plugin(), input)`.
Never depend on the network in tests.

## Versioning and releases

Changesets manages all packages. `pnpm run changeset` per user-visible change,
then merge the `chore: release` PR; `changeset publish` runs from
`.github/workflows/release.yml` with npm trusted publishing and provenance.
New packages start at `0.0.0`; the first patch changeset releases them at `0.0.1`.

## Style

Follow the core repo's TypeScript style: ESM only, `.js` extensions on relative
imports, named exports, no `any`, TSDoc on every exported symbol, no comments in
code beyond TSDoc.
