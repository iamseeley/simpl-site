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
  // Called for each content item during rendering
  transform?(content: string, context: PluginContext): Promise<{
    content: string;
    metadata?: Metadata;
  }>;
  // Called for each template render
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

export interface WebsiteConfig {
  contentSources: ContentSource[];
  plugins: PluginConfig[];
  defaultContentType: string;
  templateDir: string;
  customPluginsDir?: string;
  assetsDir?: string;
  templateHelpers?: Record<string, unknown>;
  templateCompilerOptions?: Record<string, unknown>;
  siteUrl?: string;  
  siteTitle?: string;
}

export interface Metadata {
  [key: string]: string | number | boolean | null | undefined;
}