# @mxraven/react

React template renderer for [`@mxraven/mail`](https://github.com/synqronlabs/mxraven-js).
It turns a React element into HTML and a plain-text alternative with
[`@react-email/render`](https://react.email), so the core SDK stays free of
templating dependencies.

## Install

```sh
pnpm add @mxraven/react @mxraven/mail
```

`react` and `react-dom` (`^18 || ^19`) are peer dependencies and must be
provided by your application.

## Usage

```tsx
import { Client, Message } from "@mxraven/mail";
import { react } from "@mxraven/react";

function Welcome({ firstName }: { readonly firstName: string }) {
  return (
    <html>
      <body>
        <h1>{`Welcome, ${firstName}!`}</h1>
        <p>Thanks for signing up for mxRaven.</p>
      </body>
    </html>
  );
}

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
    .render(react(), <Welcome firstName="Ada" />),
);
await client.close();
```

## API

### `react()`

```ts
function react(): TemplateRenderer<ReactElement>;
```

Creates a renderer that converts a React element into message content:

- `html` is produced with `@react-email/render`.
- `text` is derived from the rendered HTML with `toPlainText`, so the element
  is rendered only once.

When both bodies are present, `Message` sends the mail as
`multipart/alternative`. A renderer cannot provide a subject; set it with
`Message.subject()`.

## Requirements

- Node.js `>=20.19.0`
- `@mxraven/mail` `>=0.2.2 <1`
- `react` and `react-dom` `^18 || ^19`

## License

Apache-2.0. See [LICENSE](../../LICENSE) and [NOTICE](../../NOTICE).
