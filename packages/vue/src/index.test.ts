import { Message } from "@mxraven/mail";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";

import { vue } from "./index.js";

const Welcome = defineComponent({
  props: { firstName: { type: String, required: true } },
  setup(props) {
    return () => h("p", `Hello ${props.firstName}`);
  },
});

const Broken = defineComponent({
  setup() {
    throw new Error("render exploded");
  },
});

interface BuiltMessage {
  readonly body: string;
  readonly headerBlock: string;
}

async function resolve(message: Message): Promise<BuiltMessage> {
  return await (message as unknown as { resolve(): Promise<BuiltMessage> }).resolve();
}

describe("@mxraven/vue", () => {
  it("renders a Vue node to HTML and a plain-text alternative", async () => {
    const rendered = await vue().render(h(Welcome, { firstName: "Ada" }));

    expect(rendered.html).toContain("<p>Hello Ada</p>");
    expect(rendered.text).toBe("Hello Ada");
  });

  it("renders an email document node", async () => {
    const rendered = await vue().render(
      h("html", null, [h("body", null, [h("h1", null, "Welcome")])]),
    );

    expect(rendered.html).toContain("<h1>Welcome</h1>");
    expect(rendered.text).toMatch(/welcome/i);
  });

  it("omits the text alternative when the node renders none", async () => {
    const rendered = await vue().render(h("img", { alt: "", src: "https://example.com/logo.png" }));

    expect(rendered).not.toHaveProperty("text");
  });

  it("propagates rendering failures", async () => {
    await expect(vue().render(h(Broken))).rejects.toThrow("render exploded");
  });

  it("renders through Message.render as multipart/alternative", async () => {
    const built = await resolve(
      new Message()
        .from("noreply@acme.example")
        .to("customer@example.com")
        .render(vue(), h(Welcome, { firstName: "Ada" })),
    );

    expect(built.headerBlock).toContain("multipart/alternative");
    expect(built.body).toContain("<p>Hello Ada</p>");
    expect(built.body).toContain("Hello Ada");
  });
});
