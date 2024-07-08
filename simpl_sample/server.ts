import { SimplSite } from "../mod.ts";
import { config } from "./config.ts";

const website = new SimplSite(config);

Deno.serve({ port: 8000 }, async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    const { content, contentType } = await website.handleRequest(path);
    return new Response(content, {
      headers: { "content-type": contentType },
    });
  } catch (error) {
    console.error(error);
    return new Response("404 Not Found", { status: 404 });
  }
});

console.log("Server running on http://localhost:8000");