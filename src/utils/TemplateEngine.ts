import { Handlebars, HandlebarsConfig } from "https://deno.land/x/handlebars@v0.9.0/mod.ts";

export class TemplateEngine {
  private handlebars: Handlebars;

  constructor(config: Partial<HandlebarsConfig>) {
    const handlebarsConfig: HandlebarsConfig = {
      baseDir: 'templates',
      extname: '.hbs',
      layoutsDir: 'layouts/',
      partialsDir: 'partials/',
      defaultLayout: 'base',
      helpers: undefined,
      compilerOptions: undefined,
      ...config,
    };
    this.handlebars = new Handlebars(handlebarsConfig);
  }

  async render(templateName: string, context: Record<string, unknown>): Promise<string> {
    console.log(`Rendering template: ${templateName}`);
    try {
      const result = await this.handlebars.renderView(templateName, context);
      console.log(`Template rendered successfully: ${templateName}`);
      return result;
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw error;
    }
  }
}