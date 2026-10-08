import { Message } from "@mxraven/mail";
import { describe, expect, it } from "vitest";

import { react } from "./index.js";

function Welcome({ firstName }: { readonly firstName: string }) {
  return <p>{`Hello ${firstName}`}</p>;
}

function Broken(): never {
  throw new Error("render exploded");
}

interface BuiltMessage {
  readonly body: string;
  readonly headerBlock: string;
}

async function resolve(message: Message): Promise<BuiltMessage> {
  return await (message as unknown as { resolve(): Promise<BuiltMessage> }).resolve();
}

describe("@mxraven/react", () => {
  it("renders a React element to HTML and a plain-text alternative", async () => {
    const rendered = await react().render(<Welcome firstName="Ada" />);

    expect(rendered.html).toContain("<p>Hello Ada</p>");
    expect(rendered.text).toBe("Hello Ada");
  });

  it("renders an email document element", async () => {
    const rendered = await react().render(
      <html>
        <body>
          <h1>Welcome</h1>
        </body>
      </html>,
    );

    expect(rendered.html).toContain("<h1>Welcome</h1>");
    expect(rendered.text).toMatch(/welcome/i);
  });

  it("omits the text alternative when the element renders none", async () => {
    const rendered = await react().render(<img alt="" src="https://example.com/logo.png" />);

    expect(rendered).not.toHaveProperty("text");
  });

  it("propagates rendering failures", async () => {
    await expect(react().render(<Broken />)).rejects.toThrow("render exploded");
  });

  it("renders through Message.render as multipart/alternative", async () => {
    const built = await resolve(
      new Message()
        .from("noreply@acme.example")
        .to("customer@example.com")
        .render(react(), <Welcome firstName="Ada" />),
    );

    expect(built.headerBlock).toContain("multipart/alternative");
    expect(built.body).toContain("<p>Hello Ada</p>");
    expect(built.body).toContain("Hello Ada");
  });
});
