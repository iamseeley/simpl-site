/**
 * SimplSite: A flexible server-side rendered website builder for Deno
 * 
 * This module exports the main SimplSite class and related types for building
 * server-side rendered websites using Markdown content and Handlebars templates.
 * 
 * @module
 */


export { SimplSite } from "./src/SimplSite.ts";
export type {
    Plugin,
    Metadata,
    PluginContext,
    WebsiteConfig,
    ContentSource,
    PluginConfig,
    TemplateContext
  } from "./src/types.ts";