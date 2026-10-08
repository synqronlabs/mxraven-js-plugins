// @ts-nocheck -- reference example, not covered by the workspace typecheck.
import { Client, Message } from "@mxraven/mail";
import { react } from "@mxraven/react";

// Replace these with your submission credentials from the mxRaven dashboard.
const MXRAVEN_SMTP_HOST = "smtp.mxraven.email";
const MXRAVEN_USERNAME = "mxr_tx_ab12cd34ef56";
const MXRAVEN_SECRET = "your-submission-secret";

function WelcomeEmail({ firstName }: { readonly firstName: string }) {
  return (
    <html>
      <body>
        <h1>{`Welcome, ${firstName}!`}</h1>
        <p>Your account is ready.</p>
      </body>
    </html>
  );
}

const client = new Client({
  host: MXRAVEN_SMTP_HOST,
  username: MXRAVEN_USERNAME,
  secret: MXRAVEN_SECRET,
});

await client.send(
  new Message()
    .from("Acme <noreply@acme.example>")
    .to("customer@example.com")
    .subject("Welcome to mxRaven")
    .render(react(), <WelcomeEmail firstName="Ada" />),
);

await client.close();
