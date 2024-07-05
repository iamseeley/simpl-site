import type { Plugin, Metadata, PluginContext } from "../../src/types.ts";

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
    const headerRegex = /<h([1-6])(?:\s+id="([^"]*)")?>([^<]+)<\/h[1-6]>/g;
    let match;

    while ((match = headerRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const existingId = match[2];
      const text = match[3];
      const slug = existingId || this.generateSlug(text);

      console.log(`Found header: ${text} (level ${level})`);

      if (level >= this.config.minDepth! && level <= this.config.maxDepth!) {
        tocItems.push({ level, text, slug });
        console.log(`Added TOC item: ${text} (level ${level})`);

        // If there's no existing id, add one
        if (!existingId) {
          const newHeader = `<h${level} id="${slug}">${text}</h${level}>`;
          content = content.replace(match[0], newHeader);
        }
      } else {
        console.log(`Header not included in TOC (out of depth range): ${text}`);
      }
    }

    if (tocItems.length > 0) {
      const tocHtml = this.generateTocHtml(tocItems);
      content = tocHtml + content;
      console.log(`Generated TOC with ${tocItems.length} items`);
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
    console.log(`Should generate TOC for ${contentType} ${route}: ${shouldGenerate}`);
    return shouldGenerate;
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private generateTocHtml(items: TOCItem[]): string {
    let html = '<div class="table-of-contents">\n<h2>Table of Contents</h2>\n<ul>\n';
    for (const item of items) {
      const indent = '  '.repeat(item.level - this.config.minDepth!);
      html += `${indent}<li><a href="#${item.slug}">${item.text}</a></li>\n`;
    }
    html += '</ul>\n</div>\n';
    return html;
  }
}