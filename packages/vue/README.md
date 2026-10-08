# @mxraven/vue

Vue template renderer for [`@mxraven/mail`](https://github.com/synqronlabs/mxraven-js).
It turns a Vue node into HTML and a plain-text alternative with
[`@vue-email/render`](https://vue-email.com) and `html-to-text`, so the core
SDK stays free of templating dependencies.

## Install

```sh
pnpm add @mxraven/vue @mxraven/mail
```

`vue` (`^3.5.0`) is a peer dependency and must be provided by your application.

## Usage

```ts
import { Client, Message } from "@mxraven/mail";
import { vue } from "@mxraven/vue";
import { defineComponent, h } from "vue";

const Welcome = defineComponent({
  props: { firstName: { type: String, required: true } },
  setup(props) {
    return () => h("h1", `Welcome, ${props.firstName}!`);
  },
});

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
    .render(vue(), h(Welcome, { firstName: "Ada" })),
);
await client.close();
```

Render on the server: `@vue-email/render` uses `vue/server-renderer`. In Nuxt,
call `vue().render(...)` from a server route rather than a component.

## API

### `vue()`

```ts
function vue(): TemplateRenderer<VNode>;
```

Creates a renderer that converts a Vue node into message content:

- `html` is produced with `@vue-email/render`, including the XHTML doctype.
- `text` is derived from that HTML with `html-to-text`, using the renderer's
  plain-text selectors, so the node is rendered only once.

When both bodies are present, `Message` sends the mail as
`multipart/alternative`. A renderer cannot provide a subject; set it with
`Message.subject()`.

## Requirements

- Node.js `>=20.19.0`
- `@mxraven/mail` `>=0.2.2 <1`
- `vue` `^3.5.0`

## License

Apache-2.0. See [LICENSE](../../LICENSE) and [NOTICE](../../NOTICE).
