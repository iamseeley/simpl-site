import { WebsiteConfig } from "../mod.ts";
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin.ts';
import LastModifiedPlugin from './plugins/LastModifiedPlugin.ts';
import { registerPluginType } from '../src/utils/PluginRegistry.ts';

// register your plugins
registerPluginType("TableOfContentsPlugin", TableOfContentsPlugin);
registerPluginType("LastModifiedPlugin", LastModifiedPlugin);


// configure your website
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