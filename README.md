# SimplSite

[![JSR](https://jsr.io/badges/@iamseeley/simpl-site)](https://jsr.io/@iamseeley/simpl-site) 

SimplSite is a simple server-side rendered website builder built with Deno. 

Create dynamic websites using Markdown content, Handlebars templates, and a powerful plugin system for extending functionality.

## Features

- Server-side rendering for dynamic content
- Markdown support with frontmatter for metadata
- Handlebars templating with layouts and partials
- Flexible routing based on content structure
- Extensible plugin system
- Built-in development server
- Static asset handling

## Installation

To use SimplSite, you need Deno installed on your system. If you haven't installed Deno yet, follow the instructions on the [official Deno website](https://deno.land/#installation).

You can run SimplSite directly using:

```sh
deno run --allow-read --allow-write --allow-net --allow-run jsr:@iamseeley/simpl-site/cli
```

For convenience, you can install SimplSite globally:

```sh
deno install --allow-read --allow-write --allow-net --allow-run -n simpl-site jsr:@iamseeley/simpl-site/cli
```

### [Smallweb](https://github.com/pomdtr/smallweb?tab=readme-ov-file) Plugin
Navigate to your Smallweb internet folder, and run the following command to initialize a simpl-site website with Smallweb configuration.

```sh
deno install -Agf jsr:@iamseeley/simpl-site/smallweb-simpl-site
smallweb simpl-site
```

## Quick Start

1. Create a new SimplSite project:
   ```sh
   simpl-site my-website
   cd my-website
   ```

2. Start the development server:
   ```sh
   deno task dev
   ```

3. Visit `http://localhost:8000` to see your website.

## Project Structure

After initialization, your project will have the following structure:

```
my-website/
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── fonts/
├── content/
│   ├── blog/
│   ├── projects/
│   └── index.md
├── plugins/
├── templates/
│   ├── layouts/
│   └── partials/
├── config.ts
├── server.ts
└── deno.json
```

## Configuration

The `config.ts` file is where you define your website's structure and behavior. Here's an example configuration:

```typescript
import { WebsiteConfig } from "jsr:@iamseeley/simpl-site";
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin.ts';
import LastModifiedPlugin from './plugins/LastModifiedPlugin.ts';
import { registerPluginType } from 'jsr:@iamseeley/simpl-site/plugin-registry';

// Register your plugins
registerPluginType("TableOfContentsPlugin", TableOfContentsPlugin);
registerPluginType("LastModifiedPlugin", LastModifiedPlugin);

// Configure your website
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
```

## Content Creation

Create your content using Markdown files in the `content/` directory. You can use frontmatter to add metadata to your content:

```markdown
---
title: My First Post
date: 2023-07-08
tags: [web, development]
---

# Welcome to My First Post

This is the content of my post.
```

## Templating

SimplSite uses Handlebars for templating. Here's an example of the base layout:

```handlebars
<!DOCTYPE html>
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
```

Note how you can access metadata from your Markdown frontmatter using `{{metadata.title}}` and pass data to partials like `{{> header siteTitle=siteTitle}}`.

## Plugins

SimplSite's plugin system allows you to extend and modify content processing. Plugins can transform content, add metadata, and extend template contexts.

### Creating a Plugin

To create a plugin, implement the `Plugin` interface:

```typescript
import type { Plugin, Metadata, PluginContext } from "jsr:@iamseeley/simpl-site";

export default class MyCustomPlugin implements Plugin {
  name = "MyCustomPlugin";

  constructor(private options: Record<string, unknown>) {}

  async transform(content: string, context: PluginContext): Promise<{ content: string; metadata?: Metadata }> {
    // Modify content or add metadata here
    const modifiedContent = `Modified: ${content}`;
    return { 
      content: modifiedContent, 
      metadata: { customField: "value" } 
    };
  }

  async extendTemplate(templateContext: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Add or modify data available in templates
    return { 
      ...templateContext, 
      customVariable: "value" 
    };
  }
}
```

### Using Plugins

1. Create your plugin in the `plugins/` directory.
2. Register your plugin in `config.ts`:
   ```typescript
   import MyCustomPlugin from './plugins/MyCustomPlugin.ts';
   registerPluginType("MyCustomPlugin", MyCustomPlugin);
   ```
3. Add the plugin to your configuration:
   ```typescript
   plugins: [
     {
       name: "MyCustomPlugin",
       options: {
         // Any options your plugin needs
       }
     }
   ]
   ```

## Development

To start the development server:

```sh
deno task dev
```

## Deployment

There are several options for deploying your SimplSite project to production. Here are some recommended approaches:

### Deno Deploy

[Deno Deploy](https://deno.com/deploy) is the easiest and fastest way to deploy your Deno applications. It's specifically designed for Deno and offers seamless integration.

To deploy your SimplSite project on Deno Deploy:

1. Sign up for a Deno Deploy account if you haven't already.
2. Create a new project in the Deno Deploy dashboard.
3. Link your GitHub repository or upload your project files.
4. Set the entry point to your `server.ts` file.
5. Configure any necessary environment variables.

Deno Deploy will automatically handle the deployment and provide you with a URL for your site.

### Other Cloud Platforms

You can also deploy your SimplSite project to various cloud platforms that support Deno:

- **Digital Ocean**: Use a Droplet or App Platform to host your Deno application.
- **AWS Lightsail**: Set up a VPS instance to run your Deno server.
- **Google Cloud Run**: Deploy your Deno app as a containerized application.
- **Cloudflare Workers**: With some adjustments, you can run your SimplSite project on Cloudflare's edge network.
- **Kinsta**: Offers Deno hosting as part of their application hosting services.

For these platforms, you'll typically need to:

1. Set up a server or container environment.
2. Install Deno on the server.
3. Copy your project files to the server.
4. Run your `server.ts` file using a command like:

   ```sh
   deno run --allow-read --allow-write --allow-net server.ts
   ```

5. Set up a reverse proxy (like Nginx) if needed.
6. Configure any necessary environment variables.

### Self-Hosting

If you prefer to self-host, you can run your SimplSite project on any VPS or dedicated server that allows you to install Deno. Follow these general steps:

1. Set up your server and SSH access.
2. Install Deno on the server.
3. Clone or copy your project files to the server.
4. Install and configure a process manager like PM2 to keep your app running:

   ```sh
   npm install -g pm2
   pm2 start --interpreter="deno" --interpreter-args="run --allow-read --allow-write --allow-net" server.ts
   ```

5. Set up a reverse proxy with Nginx or Apache to handle HTTPS and domain routing.

## Contributing

Contributions are very welcome!

## License

SimplSite is released under the MIT License. See the [LICENSE](LICENSE) file for details.

           😊
    Enjoy 👉👈
