# @mxraven/handlebars

Handlebars template renderer for
[`@mxraven/mail`](https://github.com/synqronlabs/mxraven-js). It turns a
Handlebars template and its data into HTML and a plain-text alternative with
[`handlebars`](https://handlebarsjs.com) and `html-to-text`.

## Install

```sh
pnpm add @mxraven/handlebars @mxraven/mail
```

## Usage

```ts
import { Client, Message } from "@mxraven/mail";
import { handlebars } from "@mxraven/handlebars";

const client = new Client({
  host: "smtp.mxraven.com",
  username: process.env.MXRAVEN_USERNAME!,
  secret: process.env.MXRAVEN_SECRET!,
});

await client.send(
  new Message()
    .from("Acme <noreply@acme.example>")
    .to("customer@example.com")
    .subject("Welcome")
    .render(handlebars(), {
      source: "<h1>Welcome, {{firstName}}!</h1><p>Your account is ready.</p>",
      data: { firstName: "Ada" },
    }),
);
await client.close();
```

## API

### `handlebars()`

```ts
function handlebars(): TemplateRenderer<HandlebarsTemplate>;
```

`HandlebarsTemplate` carries the template and its context:

```ts
interface HandlebarsTemplate {
  readonly source: string;
  readonly data?: Record<string, unknown>;
}
```

Creates a renderer that compiles `source` with Handlebars and renders it with
`data`:

- `html` is the rendered template. Interpolations are HTML-escaped by default;
  use triple braces (`{{{value}}}`) to inject raw HTML.
- `text` is derived from that HTML with `html-to-text`, so the template is
  rendered only once.

When both bodies are present, `Message` sends the mail as
`multipart/alternative`. A renderer cannot provide a subject; set it with
`Message.subject()`.

## Requirements

- Node.js `>=20.19.0`
- `@mxraven/mail` `>=0.2.2 <1`

## License

Apache-2.0. See [LICENSE](../../LICENSE) and [NOTICE](../../NOTICE).
