import { Message } from "@mxraven/mail";
import { describe, expect, it } from "vitest";

import { handlebars } from "./index.js";

interface BuiltMessage {
  readonly body: string;
  readonly headerBlock: string;
}

async function resolve(message: Message): Promise<BuiltMessage> {
  return await (message as unknown as { resolve(): Promise<BuiltMessage> }).resolve();
}

describe("@mxraven/handlebars", () => {
  it("renders a template with data to HTML and a plain-text alternative", async () => {
    const rendered = await handlebars().render({
      source: "<p>Hello {{firstName}}</p>",
      data: { firstName: "Ada" },
    });

    expect(rendered.html).toBe("<p>Hello Ada</p>");
    expect(rendered.text).toBe("Hello Ada");
  });

  it("renders a template without data", async () => {
    const rendered = await handlebars().render({ source: "<p>Hello</p>" });

    expect(rendered.html).toBe("<p>Hello</p>");
    expect(rendered.text).toBe("Hello");
  });

  it("escapes HTML in interpolations by default", async () => {
    const rendered = await handlebars().render({
      source: "<p>{{value}}</p>",
      data: { value: "<strong>bold</strong>" },
    });

    expect(rendered.html).toBe("<p>&lt;strong&gt;bold&lt;/strong&gt;</p>");
  });

  it("omits the text alternative when the template renders none", async () => {
    const rendered = await handlebars().render({ source: '<img src="x.png" alt="" />' });

    expect(rendered).not.toHaveProperty("text");
  });

  it("propagates template failures", async () => {
    await expect(handlebars().render({ source: "{{#if}}" })).rejects.toThrow(/Parse error/);
  });

  it("renders through Message.render as multipart/alternative", async () => {
    const built = await resolve(
      new Message()
        .from("noreply@acme.example")
        .to("customer@example.com")
        .render(handlebars(), {
          source: "<p>Hello {{firstName}}</p>",
          data: { firstName: "Ada" },
        }),
    );

    expect(built.headerBlock).toContain("multipart/alternative");
    expect(built.body).toContain("<p>Hello Ada</p>");
    expect(built.body).toContain("Hello Ada");
  });
});
