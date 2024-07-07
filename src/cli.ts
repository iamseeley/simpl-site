import { parseArgs } from "jsr:@std/cli@0.224.0";
import { ensureDir, exists } from "jsr:@std/fs@0.224.0";
import { join } from "jsr:@std/path@0.224.0";

interface ParsedArgs {
  _: string[];
  [key: string]: unknown;
}

async function prompt(message: string): Promise<string> {
  const buf = new Uint8Array(1024);
  await Deno.stdout.write(new TextEncoder().encode(message + " "));
  const n = await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n!)).trim();
}

async function initializeWebsite(projectName: string) {
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

  const serverContent = `import { SimplSite, WebsiteConfig } from "https://raw.githubusercontent.com/your-username/simpl-site/main/mod.ts";

const config: WebsiteConfig = {
  contentSources: [
    { path: "./content/blog", type: "blog", route: "blog/" },
    { path: "./content/projects", type: "project", route: "projects/" },
    { path: "./content", type: "page", route: "" },
  ],
  plugins: [
    { name: "MarkdownPlugin" },
    { name: "TemplatePlugin", options: { baseDir: "./templates" } },
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
`;

  await Deno.writeTextFile(join(projectDir, "server.ts"), serverContent);

  const mainLayoutContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header>
    <h1>{{title}}</h1>
  </header>
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

  const pageTemplateContent = `<div class="page-content">
  {{{content}}}
</div>
`;

  await Deno.writeTextFile(join(projectDir, "templates", "page.hbs"), pageTemplateContent);

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

  const sampleCssContent = `
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #f4f4f4;
  padding: 1rem;
  margin-bottom: 1rem;
}

footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.8rem;
}
`;

  await Deno.writeTextFile(join(projectDir, "assets", "css", "styles.css"), sampleCssContent);

  const sampleJsContent = `
console.log('Welcome to your new simpl-site website!');
`;

  await Deno.writeTextFile(join(projectDir, "assets", "js", "main.js"), sampleJsContent);

  console.log(`Website '${projectName}' has been initialized successfully!`);
  console.log(`\nTo start your website:`);
  console.log(`1. cd ${projectName}`);
  console.log(`2. deno run --allow-net --allow-read server.ts`);
}

async function main() {
  const args = parseArgs(Deno.args) as ParsedArgs;

  let projectName = args._.length > 0 ? args._[0] as string : undefined;

  if (!projectName) {
    // Use custom prompt function for interactive input
    projectName = await prompt("Enter project name:");
  }

  if (projectName) {
    await initializeWebsite(projectName);
  } else {
    console.error("Project name is required.");
  }
}

if (import.meta.main) {
  main();
}