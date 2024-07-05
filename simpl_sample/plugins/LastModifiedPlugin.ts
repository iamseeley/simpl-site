import type { Plugin, Metadata, PluginContext } from "../../src/types.ts";
import { join, basename } from "https://deno.land/std/path/mod.ts";

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
      console.log(`Skipping LastModifiedPlugin for ${contentType} ${route}`);
      return { content, metadata: {} };
    }

    const sourcePath = contentSources[contentType];

    if (!sourcePath) {
      console.warn(`No source path found for content type: ${contentType}`);
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

      console.log(`Attempting to read file: ${filePath}`);

      // Get the file's last modified time
      const fileInfo = await Deno.stat(filePath);
      const lastModified = fileInfo.mtime;

      if (!lastModified) {
        console.warn(`Could not get last modified time for file: ${filePath}`);
        return { content, metadata: {} };
      }

      // Format the date
      const formattedDate = lastModified.toISOString().split('T')[0];

      // Add the last modified date to the content
      const updatedContent = `Last modified: ${formattedDate}\n\n${content}`;

      console.log(`Applied LastModifiedPlugin to ${route}`);

      // Return the updated content and metadata
      return {
        content: updatedContent,
        metadata: { lastModified: formattedDate },
      };
    } catch (error) {
      console.error(`Error in LastModifiedPlugin: ${error.message}`);
      return { content, metadata: {} };
    }
  }

  private shouldApplyPlugin(contentType: string, route: string): boolean {
    const shouldApply = (
      (this.config.contentTypes?.includes(contentType) ?? false) ||
      (this.config.routes?.some(r => route.startsWith(r)) ?? false)
    );
    console.log(`Should apply LastModifiedPlugin for ${contentType} ${route}: ${shouldApply}`);
    return shouldApply;
  }
}