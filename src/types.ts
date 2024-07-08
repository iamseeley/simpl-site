import type { HelperDelegate, RuntimeOptions } from "npm:@types/handlebars@4.1.0";

export { HelperDelegate, RuntimeOptions };

export interface ContentSource {
  path: string;
  type: string;
  route: string;
}

export interface PluginContext {
  contentType: string;
  route: string;
  templateDir: string;
  contentSources: Record<string, string>;
  siteUrl: string;
}

export interface Plugin {
  name: string;
  transform?(content: string, context: PluginContext): Promise<{
    content: string;
    metadata?: Metadata;
  }>;
  extendTemplate?(templateContext: TemplateContext): Promise<TemplateContext>;
}

export interface PluginConfig {
  name: string;
  options?: Record<string, unknown>;
}

export interface TemplateContext {
  content: string;
  metadata: Metadata;
  route: string;
  [key: string]: unknown;
}

export interface TemplateEngineConfig {
  baseDir: string;
  extname: string;
  layoutsDir: string;
  partialsDir: string;
  defaultLayout: string;
  helpers?: { [name: string]: HelperDelegate };
  compilerOptions?: RuntimeOptions;
}

export interface WebsiteConfig {
  contentSources: ContentSource[];
  plugins: PluginConfig[];
  defaultContentType: string;
  templateDir: string;
  customPluginsDir?: string;
  assetsDir?: string;
  templateHelpers?: { [name: string]: HelperDelegate };
  templateCompilerOptions?: RuntimeOptions;
  siteUrl?: string;
  siteTitle?: string;
}

export interface Metadata {
  [key: string]: string | number | boolean | null | undefined;
}