import type { TemplateRenderer } from "@mxraven/mail";
import { plainTextSelectors, render } from "@vue-email/render";
import { convert } from "html-to-text";
import { defineComponent, type VNode } from "vue";

/**
 * Creates the Vue template renderer.
 *
 * The renderer converts a Vue node into HTML with `@vue-email/render` and
 * derives the plain-text alternative from that HTML with `html-to-text`, so the
 * node is rendered exactly once. Returning both bodies lets the core send the
 * message as `multipart/alternative`.
 *
 * @remarks
 * `@vue-email/render` renders a root component, so the node is wrapped in a
 * functional component. That keeps element nodes, component nodes, and
 * fragments on the same path.
 *
 * @returns A renderer that turns Vue nodes into message content.
 *
 * @example
 * ```ts
 * await client.send(
 *   new Message()
 *     .from("Acme <noreply@acme.example>")
 *     .to("customer@example.com")
 *     .render(vue(), h(Welcome, { firstName: "Ada" })),
 * );
 * ```
 *
 * @public
 */
export function vue(): TemplateRenderer<VNode> {
  return {
    async render(node) {
      const template = defineComponent({ setup: () => () => node });
      const html = await render(template);
      const text = convert(html, { wordwrap: false, selectors: plainTextSelectors });
      return text === "" ? { html } : { html, text };
    },
  };
}
