import { SimplSite, WebsiteConfig } from "../mod.ts";

const config: WebsiteConfig = {
  contentSources: [
    { path: "./content/blog", type: "blog", route: "blog/" },
    { path: "./content/projects", type: "project", route: "projects/" },
    { path: "./content", type: "page", route: "" },
  ],
  plugins: [
    {
      name: "TableOfContentsPlugin",
      options: {
        routes: ["/plugin-example"],
        minDepth: 2,
        maxDepth: 4
      }
      },
      {
      name: "LastModifiedPlugin",
      options: {
        contentTypes: ["blog"],
        routes: ["/about"]
      }
    }
  ],
  defaultContentType: "page",
  templateDir: "./templates",
  customPluginsDir: "./plugins",
  assetsDir: "./assets",
};


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
