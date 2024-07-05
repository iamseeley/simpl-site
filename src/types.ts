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
}

export interface Plugin {
  name: string;

  // Called for each content item
  transform?(content: string, context: PluginContext): Promise<{
    content: string;
    metadata?: Metadata;
  }>;

  // Called once before processing all content
  beforeBuild?(): Promise<void>;

  // Called once after processing all content
  afterBuild?(): Promise<void>;

  // Called for each template render
  extendTemplate?(templateContext: Record<string, unknown>): Promise<Record<string, unknown>>;

}

export interface PluginConfig {
  name: string;
  options?: Record<string, unknown>;
}

export interface TemplateContext {
  content: string;
  [key: string]: unknown;
};


export interface WebsiteConfig {
  contentSources: ContentSource[];
  plugins: PluginConfig[];
  defaultContentType: string;
  templateDir: string;
  customPluginsDir?: string;
  assetsDir?: string;
  templateHelpers?: Record<string, unknown>;
  templateCompilerOptions?: Record<string, unknown>;
}

export interface Metadata {
  [key: string]: string | number | boolean | null | undefined;
}

