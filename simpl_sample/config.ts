import { WebsiteConfig } from "../mod.ts";

export const config: WebsiteConfig = {
  contentSources: [
    { path: "./content/blog", type: "blog", route: "blog/" },
    { path: "./content/projects", type: "project", route: "projects/" },
    { path: "./content", type: "page", route: "" },
  ],
  plugins: [
    {
      name: "TableOfContentsPlugin",
      options: {
        routes: ["/plugin-example", "/plugin-docs"],
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
  siteTitle: "Simpl Site",
};