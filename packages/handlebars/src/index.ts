import type { TemplateRenderer } from "@mxraven/mail";
import Handlebars from "handlebars";
import { convert, type SelectorDefinition } from "html-to-text";

/**
 * A Handlebars template and the data it renders with.
 *
 * @public
 */
export interface HandlebarsTemplate {
  /** The Handlebars source. */
  readonly source: string;
  /** The data exposed to the template as its context. */
  readonly data?: Record<string, unknown>;
}

const plainTextSelectors: SelectorDefinition[] = [
  { selector: "img", format: "skip" },
  { selector: "a", options: { linkBrackets: false } },
];

/**
 * Creates the Handlebars template renderer.
 *
 * The renderer compiles the template source with `handlebars`, renders it with
 * the given data, and derives the plain-text alternative from the HTML with
 * `html-to-text`. Returning both bodies lets the core send the message as
 * `multipart/alternative`.
 *
 * @returns A renderer that turns Handlebars templates into message content.
 *
 * @example
 * ```ts
 * await client.send(
 *   new Message()
 *     .from("Acme <noreply@acme.example>")
 *     .to("customer@example.com")
 *     .render(handlebars(), {
 *       source: "<h1>Welcome, {{firstName}}!</h1>",
 *       data: { firstName: "Ada" },
 *     }),
 * );
 * ```
 *
 * @public
 */
export function handlebars(): TemplateRenderer<HandlebarsTemplate> {
  return {
    async render(template) {
      const compiled = Handlebars.compile(template.source);
      const html = compiled(template.data ?? {});
      const text = convert(html, { wordwrap: false, selectors: plainTextSelectors });
      return text === "" ? { html } : { html, text };
    },
  };
}
