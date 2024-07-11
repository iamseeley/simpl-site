/**
 * SimplSite CLI
 * 
 * This module provides the command-line interface for SimplSite, allowing users
 * to create and manage SimplSite projects from the terminal.
 * 
 * Usage:
 *   deno run --allow-read --allow-write --allow-net jsr:@iamseeley/simpl-site/cli
 * 
 * Commands:
 *   - Create a new project: Simply run the CLI and follow the prompts
 * 
 * The CLI checks for Deno installation, guides the user through project creation,
 * and sets up the initial project structure and configuration.
 * 
 * @module
 */

import { parseArgs } from "jsr:@std/cli@0.224.0";
import { ensureDir, exists } from "jsr:@std/fs@0.224.0";
import { join } from "jsr:@std/path@0.224.0";

// interface ParsedArgs {
//   _: string[];
//   [key: string]: unknown;
//   smallWeb?: boolean;
// }

async function initializeWebsite(projectName: string, isSmallWeb: boolean) {
  const projectDir = join(Deno.cwd(), projectName);
  if (await exists(projectDir)) {
    console.error(`Error: Directory '${projectName}' already exists.`);
    return;
  }

  await ensureDir(projectDir);
  await ensureDir(join(projectDir, "content"));
  await ensureDir(join(projectDir, "content", "blog"));
  await ensureDir(join(projectDir, "content", "projects"));
  await ensureDir(join(projectDir, "templates"));
  await ensureDir(join(projectDir, "templates", "layouts"));
  await ensureDir(join(projectDir, "templates", "partials"));
  await ensureDir(join(projectDir, "plugins"));

  await ensureDir(join(projectDir, "assets"));
  await ensureDir(join(projectDir, "assets", "fonts"));
  await ensureDir(join(projectDir, "assets", "images"));
  await ensureDir(join(projectDir, "assets", "css"));
  await ensureDir(join(projectDir, "assets", "js"));

  const configContent = `import { WebsiteConfig } from "jsr:@iamseeley/simpl-site";
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin.ts';
import LastModifiedPlugin from './plugins/LastModifiedPlugin.ts';
import { registerPluginType } from 'jsr:@iamseeley/simpl-site/plugin-registry';

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
    siteTitle: "${projectName}",
  };`;
  
await Deno.writeTextFile(join(projectDir, "config.ts"), configContent);

// const serverContent = `import { SimplSite } from "jsr:@iamseeley/simpl-site";
//   import { config } from "./config.ts";
  
//   const website = new SimplSite(config);
  
//   Deno.serve({ port: 8000 }, async (req: Request) => {
//     const url = new URL(req.url);
//     const path = url.pathname;
  
//     try {
//       const { content, contentType } = await website.handleRequest(path);
//       return new Response(content, {
//         headers: { "content-type": contentType },
//       });
//     } catch (error) {
//       console.error(error);
//       return new Response("404 Not Found", { status: 404 });
//     }
//   });
  
//   console.log("Server running on http://localhost:8000");`;
  
//   await Deno.writeTextFile(join(projectDir, "server.ts"), serverContent);

  const smallWebServerContent = `import { SimplSite } from "jsr:@iamseeley/simpl-site";
import { config } from "./config.ts";

const website = new SimplSite(config);

async function handleRequest(request: Request): Promise<Response> {
const url = new URL(request.url);
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
}

export default {
async fetch(request: Request): Promise<Response> {
  try {
    return await handleRequest(request);
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
};

if (import.meta.main) {
console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, handleRequest);
}`;

const serverContent =`import { SimplSite } from "jsr:@iamseeley/simpl-site";
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

console.log("Server running on http://localhost:8000");`;

if (isSmallWeb) {
  await Deno.writeTextFile(join(projectDir, "main.ts"), smallWebServerContent);
} else {
  await Deno.writeTextFile(join(projectDir, "server.ts"), serverContent);
}



  const mainLayoutContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{metadata.title}}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  {{> header siteTitle=siteTitle}}
  <main>
    {{{body}}}
  </main>
  <footer>
    <p>Powered by simpl-site</p>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>
`;

await Deno.writeTextFile(join(projectDir, "templates", "layouts", "base.hbs"), mainLayoutContent);

const headerPartial = `<header class="site-header">
<div class="site-title">
  <a href="/">{{siteTitle}}</a>
</div>
<nav class="site-navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/blog/new-blog">Blog</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
</header>
`

await Deno.writeTextFile(join(projectDir, "templates", "partials", "header.hbs"), headerPartial);


const pageTemplateContent = `<div class="page-content">
  {{{content}}}
</div>
`;

const blogTemplateContent = `<article class="blog-content">
  {{{content}}}
</article>
`;


await Deno.writeTextFile(join(projectDir, "templates", "page.hbs"), pageTemplateContent);

await Deno.writeTextFile(join(projectDir, "templates", "blog.hbs"), blogTemplateContent);

const samplePageContent = `---
title: Home
---
# Welcome to Your New Website
This is a sample page created by simpl-site.

## Features:
- Markdown support
- Dynamic content rendering
- Flexible routing
- Static asset handling

Enjoy building your website!
`;

await Deno.writeTextFile(join(projectDir, "content", "index.md"), samplePageContent);

const tocPluginExample = `---
title: TOC Plugin Example
---

# Welcome to Your New Website

## Introduction

This is a sample page created by simpl-site, now with a table of contents!

## Features

### Markdown Support

SimplSite fully supports Markdown syntax for easy content creation.

### Dynamic Content Rendering

Your content is dynamically rendered, allowing for flexible and efficient updates.

### Flexible Routing

Set up your site structure with ease using our flexible routing system.

### Plugin System

Extend functionality with plugins, like this table of contents generator!

## Getting Started

To start building your site, simply edit the markdown files in your content directory.

## Conclusion

Enjoy building your website with SimplSite!
`;

await Deno.writeTextFile(join(projectDir, "content", "plugin-example.md"), tocPluginExample);

const aboutPage = `---
title: about
---
## this is the about page
`;

await Deno.writeTextFile(join(projectDir, "content", "about.md"), aboutPage);

const newBlog = `---
title: new blog
---
## start your blog!
`;

await Deno.writeTextFile(join(projectDir, "content", "blog", "new-blog.md"), newBlog);

const fourOFour = `---
title: 404
---

## hi there, this page doesn't exist. yet.`;

await Deno.writeTextFile(join(projectDir, "content", "404.md"), fourOFour);

const denoJsonContent = {
  tasks: {
    dev: isSmallWeb 
      ? "deno run --allow-read --allow-write --allow-net --allow-run main.ts"
      : "deno run --allow-read --allow-write --allow-net --allow-run server.ts"
  }
};

await Deno.writeTextFile(
  join(projectDir, "deno.json"),
  JSON.stringify(denoJsonContent, null, 2)
);

const tocPluginContent = `import type { Plugin, Metadata, PluginContext } from "jsr:@iamseeley/simpl-site";

interface TOCItem {
  level: number;
  text: string;
  slug: string;
}

interface TOCConfig {
  routes?: string[];
  contentTypes?: string[];
  minDepth?: number;
  maxDepth?: number;
}

export default class TableOfContentsPlugin implements Plugin {
  name = "TableOfContentsPlugin";
  private config: TOCConfig;

  constructor(config: TOCConfig = {}) {
    this.config = {
      minDepth: 1,
      maxDepth: 6,
      ...config
    };
    console.log("TableOfContentsPlugin initialized with config:", this.config);
  }

  async transform(content: string, context: PluginContext): Promise<{ content: string; metadata?: Metadata }> {
    console.log("TableOfContentsPlugin.transform called with context:", context);
    console.log("Content received:", content.substring(0, 200) + "..."); // Log first 200 characters of content

    if (!this.shouldGenerateTOC(context.contentType, context.route)) {
      console.log("Skipping TOC generation for this content");
      return { content };
    }

    console.log("Generating TOC for content");
    const tocItems: TOCItem[] = [];
    const headerRegex = /<h([1-6])(?:\\s+id="([^"]*)")?>([^<]+)<\\/h[1-6]>/g;
    let match;

    while ((match = headerRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const existingId = match[2];
      const text = match[3];
      const slug = existingId || this.generateSlug(text);
      console.log(\`Found header: \${text} (level \${level})\`);

      if (level >= this.config.minDepth! && level <= this.config.maxDepth!) {
        tocItems.push({ level, text, slug });
        console.log(\`Added TOC item: \${text} (level \${level})\`);
        if (!existingId) {
          const newHeader = \`<h\${level} id="\${slug}">\${text}</h\${level}>\`;
          content = content.replace(match[0], newHeader);
        }
      } else {
        console.log(\`Header not included in TOC (out of depth range): \${text}\`);
      }
    }

    if (tocItems.length > 0) {
      const tocHtml = this.generateTocHtml(tocItems);
      content = tocHtml + content;
      console.log(\`Generated TOC with \${tocItems.length} items\`);
    } else {
      console.log("No TOC items found");
    }

    return {
      content,
      metadata: {
        tocGenerated: tocItems.length > 0,
        tocItemCount: tocItems.length,
      },
    };
  }

  private shouldGenerateTOC(contentType: string, route: string): boolean {
    const shouldGenerate = (
      (this.config.contentTypes?.includes(contentType) ?? false) ||
      (this.config.routes?.some(r => route.startsWith(r)) ?? false)
    );
    console.log(\`Should generate TOC for \${contentType} \${route}: \${shouldGenerate}\`);
    return shouldGenerate;
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private generateTocHtml(items: TOCItem[]): string {
    let html = '<div class="table-of-contents">\\n<h2>Table of Contents</h2>\\n<ul>\\n';
    for (const item of items) {
      const indent = ' '.repeat(item.level - this.config.minDepth!);
      html += \`\${indent}<li><a href="#\${item.slug}">\${item.text}</a></li>\\n\`;
    }
    html += '</ul>\\n</div>\\n';
    return html;
  }
}`;

await Deno.writeTextFile(join(projectDir, "plugins", "TableOfContentsPlugin.ts"), tocPluginContent);

const lastModifiedPluginContent = `import type { Plugin, Metadata, PluginContext } from "jsr:@iamseeley/simpl-site";
import { join, basename } from "jsr:@std/path@0.218.2";

interface LastModifiedConfig {
  routes?: string[];
  contentTypes?: string[];
}

export default class LastModifiedPlugin implements Plugin {
  name = "LastModifiedPlugin";
  private config: LastModifiedConfig;

  constructor(config: LastModifiedConfig = {}) {
    this.config = config;
    console.log("LastModifiedPlugin initialized with config:", this.config);
  }

  async transform(content: string, context: PluginContext): Promise<{ content: string; metadata: Metadata }> {
    const { contentType, route, contentSources } = context;

    if (!this.shouldApplyPlugin(contentType, route)) {
      console.log(\`Skipping LastModifiedPlugin for \${contentType} \${route}\`);
      return { content, metadata: {} };
    }

    const sourcePath = contentSources[contentType];
    if (!sourcePath) {
      console.warn(\`No source path found for content type: \${contentType}\`);
      return { content, metadata: {} };
    }

    try {
      // Extract the filename from the route
      let filename = basename(route);
      if (!filename.endsWith('.md')) {
        filename += '.md';
      }

      // Construct the file path
      const filePath = join(sourcePath, filename);
      console.log(\`Attempting to read file: \${filePath}\`);

      // Get the file's last modified time
      const fileInfo = await Deno.stat(filePath);
      const lastModified = fileInfo.mtime;

      if (!lastModified) {
        console.warn(\`Could not get last modified time for file: \${filePath}\`);
        return { content, metadata: {} };
      }

      // Format the date
      const formattedDate = lastModified.toISOString().split('T')[0];

      // Add the last modified date to the content
      const updatedContent = \`Last modified: \${formattedDate}\\n\\n\${content}\`;
      console.log(\`Applied LastModifiedPlugin to \${route}\`);

      // Return the updated content and metadata
      return {
        content: updatedContent,
        metadata: { lastModified: formattedDate },
      };
    } catch (error) {
      console.error(\`Error in LastModifiedPlugin: \${error.message}\`);
      return { content, metadata: {} };
    }
  }

  private shouldApplyPlugin(contentType: string, route: string): boolean {
    const shouldApply = (
      (this.config.contentTypes?.includes(contentType) ?? false) ||
      (this.config.routes?.some(r => route.startsWith(r)) ?? false)
    );
    console.log(\`Should apply LastModifiedPlugin for \${contentType} \${route}: \${shouldApply}\`);
    return shouldApply;
  }
}`;

await Deno.writeTextFile(join(projectDir, "plugins", "LastModifiedPlugin.ts"), lastModifiedPluginContent)


const sampleCssContent = `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

a {
  color: inherit;
}

header {
  background-color: #f4f4f4;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: .6rem;
}



footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.8rem;
}


.table-of-contents {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1em;
  margin-bottom: 1em;
}

.table-of-contents h2 {
  margin-top: 0;
}

.table-of-contents ul {
  list-style-type: none;
  padding-left: 0;
}

.table-of-contents ul ul {
  padding-left: 1.5em;
}

.table-of-contents a {
  text-decoration: none;
  color: #333;
}

.table-of-contents a:hover {
  text-decoration: underline;
}
`;

  await Deno.writeTextFile(join(projectDir, "assets", "css", "styles.css"), sampleCssContent);

  const sampleJsContent = `
console.log('Welcome to your new simpl-site website!');
`;

  await Deno.writeTextFile(join(projectDir, "assets", "js", "main.js"), sampleJsContent);
}




async function prompt(message: string): Promise<string> {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(message + " "));
  const n = await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n!)).trim();
}

async function checkDenoInstallation(): Promise<boolean> {
  console.log("Checking if Deno is installed...");
  try {
    const command = new Deno.Command("deno", {
      args: ["--version"],
      stdout: "null",
      stderr: "null",
    });
    const { success } = await command.output();
    return success;
  } catch {
    return false;
  }
}

function getDenoInstallInstructions(): string {
  const isWindows = Deno.build.os === "windows";
  if (isWindows) {
    return "To install Deno on Windows, run this command in PowerShell:\n\nirm https://deno.land/install.ps1 | iex";
  } else {
    return "To install Deno on macOS or Linux, run this command in your terminal:\n\ncurl -fsSL https://deno.land/install.sh | sh";
  }
}

export async function main(args: string[]) {
  console.log("Hi there, welcome to Simpl Site!");
  console.log("This tool will help you create a new server-side rendered website.");

  const isDenoInstalled = await checkDenoInstallation();
  if (!isDenoInstalled) {
    console.log("\nDeno is not installed on your system.");
    console.log("Deno is required to use Simpl Site.");
    console.log(getDenoInstallInstructions());
    console.log("\nPlease install Deno and then run this tool again.");
    return;
  }

  console.log("Great! Deno is installed on your system.");

  const parsedArgs = parseArgs(args, {
    boolean: ["smallweb"],
    string: ["_"],
  });

  const isSmallWeb = parsedArgs.smallweb === true;
  let projectName = parsedArgs._[0] as string | undefined;

  if (!projectName) {
    projectName = await prompt("Enter your project name:");
  }

  if (projectName) {
    console.log(`Great! Let's create your new website project: ${projectName}`);
    console.log(`SmallWeb mode: ${isSmallWeb ? "enabled" : "disabled"}`);
    await initializeWebsite(projectName, isSmallWeb);
    console.log(`\nYour Simpl Site project "${projectName}" has been created successfully!`);
    console.log("To start your website:");
    console.log(`1. cd ${projectName}`);
    if (isSmallWeb) {
      console.log("2. Follow SmallWeb deployment instructions");
    } else {
      console.log("2. deno task dev");
    }
    console.log("\nHappy building!");
  } else {
    console.error("Project name is required. Please try again.");
  }
}

if (import.meta.main) {
  main(Deno.args);
}