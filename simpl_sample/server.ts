import { SimplSite } from "../mod.ts";
import { config } from "./config.ts";

const website = new SimplSite(config);

Deno.serve({ port: 8000 }, async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    const { content, contentType, status, size } = await website.handleRequest(path);

    const headers = new Headers({
      "content-type": contentType,
    });

    if (size !== undefined) {
      headers.set("content-length", size.toString());
    }

    return new Response(content, {
      status: status,
      headers: headers,
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log("Server running on http://localhost:8000");