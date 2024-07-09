import type { Plugin } from "../types.ts";

const pluginRegistry: Record<string, new (options?: Record<string, unknown>) => Plugin> = {};

/**
 * Registers a plugin type in the registry.
 * @param name - The name to register the plugin under.
 * @param pluginClass - The plugin class constructor.
 */
export function registerPluginType(name: string, pluginClass: new (options?: Record<string, unknown>) => Plugin) {
  pluginRegistry[name] = pluginClass;
}


/**
 * Retrieves a plugin class from the registry.
 * @param name - The name of the plugin to retrieve.
 * @returns The plugin class constructor.
 * @throws Error if the plugin is not found in the registry.
 */
export function getPluginClass(name: string): new (options?: Record<string, unknown>) => Plugin {
  const pluginClass = pluginRegistry[name];
  if (!pluginClass) {
    throw new Error(`Plugin ${name} not found in registry`);
  }
  return pluginClass;
}