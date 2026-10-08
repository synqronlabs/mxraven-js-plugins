// @ts-nocheck -- reference example, not covered by the workspace typecheck.
import { Client, Message } from "@mxraven/mail";
import { vue } from "@mxraven/vue";
import { defineComponent, h } from "vue";

// Replace these with your submission credentials from the mxRaven dashboard.
const MXRAVEN_SMTP_HOST = "smtp.mxraven.email";
const MXRAVEN_USERNAME = "mxr_tx_ab12cd34ef56";
const MXRAVEN_SECRET = "your-submission-secret";

const WelcomeEmail = defineComponent({
  props: { firstName: { type: String, required: true } },
  setup(props) {
    return () =>
      h("html", { lang: "en" }, [
        h("body", [h("h1", `Welcome, ${props.firstName}!`), h("p", "Your account is ready.")]),
      ]);
  },
});

const client = new Client({
  host: MXRAVEN_SMTP_HOST,
  username: MXRAVEN_USERNAME,
  secret: MXRAVEN_SECRET,
});

// @vue-email/render uses vue/server-renderer, so render on the server.
// In Nuxt, call this from a server route instead of a component.
await client.send(
  new Message()
    .from("Acme <noreply@acme.example>")
    .to("customer@example.com")
    .subject("Welcome to mxRaven")
    .render(vue(), h(WelcomeEmail, { firstName: "Ada" })),
);

await client.close();
