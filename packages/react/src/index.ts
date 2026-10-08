import type { TemplateRenderer } from "@mxraven/mail";
import { render, toPlainText } from "@react-email/render";
import type { ReactElement } from "react";

/**
 * Creates the React template renderer.
 *
 * The renderer converts a React element into HTML with `@react-email/render`
 * and derives the plain-text alternative from that HTML, so the element is
 * rendered exactly once. Returning both bodies lets the core send the message
 * as `multipart/alternative`.
 *
 * @returns A renderer that turns React elements into message content.
 *
 * @example
 * ```tsx
 * await client.send(
 *   new Message()
 *     .from("Acme <noreply@acme.example>")
 *     .to("customer@example.com")
 *     .render(react(), <Welcome firstName="Ada" />),
 * );
 * ```
 *
 * @public
 */
export function react(): TemplateRenderer<ReactElement> {
  return {
    async render(element) {
      const html = await render(element);
      const text = toPlainText(html);
      return text === "" ? { html } : { html, text };
    },
  };
}
