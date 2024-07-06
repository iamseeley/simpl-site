---
title: Plugin Docs
---

## Overview

The plugin system allows you to extend the functionality of the Simpl Site website builder. Plugins can transform content, modify metadata, extend template contexts, and more. This page covers how to create and use plugins.

## Plugin Architecture

Plugins in this system are TypeScript classes that implement the `Plugin` interface. They can hook into various stages of the content processing and rendering pipeline.

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  transform?(content: string, context: PluginContext): Promise<{
    content: string;
    metadata?: Metadata;
  }>;
  extendTemplate?(templateContext: TemplateContext): Promise<TemplateContext>;
}
```

## Creating a Plugin

To create a plugin:

1. Create a new TypeScript file in your plugins directory (e.g., `myPlugin.ts`).
2. Define a class that implements the `Plugin` interface.
3. Export the class as the default export.

Example:

```typescript
import type { Plugin, PluginContext, TemplateContext, Metadata } from "../types.ts";

export default class MyPlugin implements Plugin {
  name = "MyPlugin";

  async transform(content: string, context: PluginContext): Promise<{ content: string; metadata?: Metadata }> {
    // Transform content here
    return { content, metadata: { myCustomField: "value" } };
  }

  async extendTemplate(templateContext: TemplateContext): Promise<TemplateContext> {
    // Extend template context here
    return { ...templateContext, myCustomVariable: "value" };
  }
}
```

## Plugin Hooks

### `transform`

The `transform` hook allows you to modify content and metadata before it's rendered.

- **Input**: 
  - `content`: The raw content string.
  - `context`: A `PluginContext` object containing information about the current content being processed.
- **Output**: An object containing the transformed content and optional metadata.

### `extendTemplate`

The `extendTemplate` hook allows you to add or modify data available in templates.

- **Input**: The current `TemplateContext`.
- **Output**: The modified `TemplateContext`.

## Context Objects

### PluginContext

```typescript
interface PluginContext {
  contentType: string;
  route: string;
  templateDir: string;
  contentSources: Record<string, string>;
  siteUrl: string;
}
```

### TemplateContext

```typescript
interface TemplateContext {
  content: string;
  metadata: Metadata;
  route: string;
  [key: string]: unknown;
}
```

## Using Plugins

To use a plugin, add it to your site configuration:

```typescript
const config: WebsiteConfig = {
  // ... other config options ...
  plugins: [
    {
      name: "MyPlugin",
      options: {
        // Any plugin-specific options
      }
    }
  ],
  // ... other config options ...
};
```

## Plugin Execution Order

Plugins are executed in the order they are defined in the configuration. The `transform` hook is called for each plugin during content processing, and the `extendTemplate` hook is called for each plugin before template rendering.

## Examples

### Table of Contents Plugin

```typescript
import type { Plugin, PluginContext, Metadata } from "../types.ts";

interface TOCItem {
  level: number;
  text: string;
  slug: string;
}

export default class TableOfContentsPlugin implements Plugin {
  name = "TableOfContentsPlugin";

  async transform(content: string, context: PluginContext): Promise<{ content: string; metadata?: Metadata }> {
    const lines = content.split('\n');
    const tocItems: TOCItem[] = [];
    const updatedLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('#')) {
        const level = line.indexOf(' ');
        const text = line.slice(level + 1).trim();
        const slug = this.generateSlug(text);
        tocItems.push({ level, text, slug });
        updatedLines.push(`${line} {#${slug}}`);
      } else {
        updatedLines.push(line);
      }
    }

    const tocHtml = this.generateTocHtml(tocItems);
    updatedLines.unshift(tocHtml);

    return {
      content: updatedLines.join('\n'),
      metadata: {
        tocGenerated: true,
        tocItemCount: tocItems.length,
      },
    };
  }

  private generateSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  private generateTocHtml(items: TOCItem[]): string {
    // Implementation of TOC HTML generation
  }
}
```

### Last Modified Plugin

```typescript
import type { Plugin, PluginContext, Metadata } from "../types.ts";

export default class LastModifiedPlugin implements Plugin {
  name = "LastModifiedPlugin";

  async transform(content: string, context: PluginContext): Promise<{ content: string; metadata?: Metadata }> {
    const { contentType, contentSources } = context;
    const sourcePath = contentSources[contentType];
    const filePath = `${sourcePath}/${context.route.replace(/^\//, '')}.md`;

    const fileInfo = await Deno.stat(filePath);
    const lastModified = fileInfo.mtime?.toISOString().split('T')[0] || '';

    return {
      content: `Last modified: ${lastModified}\n\n${content}`,
      metadata: { lastModified },
    };
  }
}
```

## Best Practices

1. Keep plugins focused on a single responsibility.
2. Use the provided context objects to access necessary information.
3. Handle errors gracefully and provide meaningful error messages.
4. Use TypeScript to ensure type safety and improve developer experience.
5. Document your plugin's functionality and any configuration options it accepts.

By following this documentation, you should be able to create and use plugins effectively in your website.