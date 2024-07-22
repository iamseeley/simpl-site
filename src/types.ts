import type { HelperDelegate, RuntimeOptions } from "npm:@types/handlebars@4.1.0";

export { HelperDelegate, RuntimeOptions };

/**
 * Represents a source of content for the website.
 */
export interface ContentSource {
  /** The file system path to the content directory. */
  path: string;
  /** The type of content (e.g., "page", "blog", "project"). */
  type: string;
  /** The base route for this content type. */
  route: string;
}

/**
 * Provides context for plugin operations.
 */
export interface PluginContext {
  /** The type of content being processed. */
  contentType: string;
  /** The route of the current content. */
  route: string;
  /** The directory where templates are stored. */
  templateDir: string;
  /** A record of content sources, keyed by content type. */
  contentSources: Record<string, string>;
  /** The base URL of the site. */
  siteUrl: string;
}

/**
 * Represents a plugin that can modify content or extend template context.
 */
export interface Plugin {
  /** The name of the plugin. */
  name: string;
  
  /**
   * Transforms the content and optionally adds metadata.
   * @param content - The content to transform.
   * @param context - The context of the current content being processed.
   * @returns A promise that resolves to an object containing the transformed content and optional metadata.
   */
  transform?(content: string, context: PluginContext): Promise<{ content: string; metadata?: Metadata }>;
  
  /**
   * Extends the template context with additional data.
   * @param templateContext - The current template context.
   * @returns A promise that resolves to the extended template context.
   */
  extendTemplate?(templateContext: TemplateContext): Promise<TemplateContext>;
}

/**
 * Configuration options for a plugin.
 */
export interface PluginConfig {
  /** The name of the plugin to use. */
  name: string;
  /** Optional configuration options for the plugin. */
  options?: Record<string, unknown>;
}

/**
 * Represents the context provided to templates during rendering.
 */
export interface TemplateContext {
  /** The main content to be rendered. */
  content: string;
  /** Metadata associated with the content. */
  metadata: Metadata;
  /** The current route being rendered. */
  route: string;
  /** Any additional key-value pairs that might be added by plugins or the system. */
  [key: string]: unknown;
}

/**
 * Configuration options for the template engine.
 */
export interface TemplateEngineConfig {
  /** The base directory for templates. */
  baseDir: string;
  /** The file extension for template files (e.g., ".hbs"). */
  extname: string;
  /** The directory containing layout templates, relative to baseDir. */
  layoutsDir: string;
  /** The directory containing partial templates, relative to baseDir. */
  partialsDir: string;
  /** The name of the default layout template to use. */
  defaultLayout: string;
  /** 
   * Custom helper functions for use in templates. 
   * Keys are helper names, values are helper functions.
   */
  helpers?: { [name: string]: HelperDelegate };
  /** 
   * Compiler options for the Handlebars template engine.
   * These options are passed directly to Handlebars.compile().
   */
  compilerOptions?: RuntimeOptions;
}

/**
 * Configuration options for a SimplSite instance.
 */
export interface WebsiteConfig {
  /** 
   * Array of content sources for the website. 
   * Each source defines a directory, content type, and route.
   */
  contentSources: ContentSource[];
  /** 
   * Array of plugins to use. 
   * Plugins can transform content and extend template contexts.
   */
  plugins: PluginConfig[];
  /** 
   * The default content type to use when not specified.
   * This is typically "page" for general content.
   */
  defaultContentType: string;
  /** 
   * The directory where templates are stored.
   * This is used as the base directory for the template engine.
   */
  templateDir: string;
  /** 
   * The directory where custom plugins are stored.
   * If provided, SimplSite will look for plugin files in this directory.
   */
  customPluginsDir?: string;
  /** 
   * The directory where static assets (CSS, JS, images, etc.) are stored.
   * These files are served directly without processing.
   */
  assetsDir?: string;
  /** 
   * Custom helper functions for use in templates.
   * These are passed to the template engine configuration.
   */
  templateHelpers?: { [name: string]: HelperDelegate };
  /** 
   * Compiler options for the template engine.
   * These are passed to the template engine configuration.
   */
  templateCompilerOptions?: RuntimeOptions;
  /** 
   * The base URL of the site.
   * This is used for generating absolute URLs and in plugins.
   */
  siteUrl?: string;
  /** 
   * The title of the site.
   * This can be used in templates and metadata.
   */
  siteTitle?: string;
  /**
   * Caching pages and templates option.
   * This is used to enable caching for sites and exclude some routes from caching
   */
  caching?: {
    enabled: boolean;
    excludedRoutes?: string[];
  };
}

/**
 * Represents metadata for a piece of content.
 * This can include any key-value pairs extracted from frontmatter or added by plugins.
 */
export interface Metadata {
  [key: string]: string | number | boolean | null | undefined;
}
