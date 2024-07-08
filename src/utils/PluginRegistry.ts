import type { Plugin } from "../types.ts";

const pluginRegistry: Record<string, new (options?: Record<string, unknown>) => Plugin> = {};

export function registerPluginType(name: string, pluginClass: new (options?: Record<string, unknown>) => Plugin) {
  pluginRegistry[name] = pluginClass;
}

export function getPluginClass(name: string): new (options?: Record<string, unknown>) => Plugin {
  const pluginClass = pluginRegistry[name];
  if (!pluginClass) {
    throw new Error(`Plugin ${name} not found in registry`);
  }
  return pluginClass;
}