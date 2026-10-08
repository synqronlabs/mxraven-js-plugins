# mxRaven JS Plugins

Official plugins for the [`@mxraven/mail`](https://github.com/synqronlabs/mxraven-js)
TypeScript SDK. Each package adapts a template engine to the SDK's generic
`TemplateRenderer` contract.

## Packages

| Package               | Engine                          | Status    |
| --------------------- | ------------------------------- | --------- |
| `@mxraven/react`      | React via `@react-email/render` | available |
| `@mxraven/vue`        | Vue via `@vue-email/render`     | available |
| `@mxraven/handlebars` | Handlebars                      | available |
| `@mxraven/mjml`       | MJML                            | planned   |
| `@mxraven/pug`        | Pug                             | planned   |

## Contract

A plugin exports a factory that returns a `TemplateRenderer` from
`@mxraven/mail`:

```ts
import type { TemplateRenderer } from "@mxraven/mail";

export function react(): TemplateRenderer<ReactElement> {
  return {
    render(element) {
      return { html: "..." };
    },
  };
}
```

Usage in an application:

```ts
import { react } from "@mxraven/react";

await client.send(
  new Message()
    .from("Acme <noreply@acme.example>")
    .to("customer@example.com")
    .subject("Welcome")
    .render(react(), <Welcome firstName="Ada" />),
);
```

## Development

Requires `@mxraven/mail@0.2.2` or later.

```sh
pnpm install
pnpm run check   # format, lint, typecheck, test, build
```

## Structure

```
packages/
  react/       @mxraven/react
  vue/         @mxraven/vue
  handlebars/  @mxraven/handlebars
```

## License

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
