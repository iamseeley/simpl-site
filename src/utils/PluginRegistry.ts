/**
 * SimplSite Plugin Registry
 * 
 * This module provides functionality for registering and retrieving plugin types
 * in the SimplSite system. It acts as a central registry for all plugins,
 * allowing dynamic loading and instantiation of plugins based on configuration.
 * 
 * Usage:
 *   import { registerPluginType, getPluginClass } from "@iamseeley/simpl-site/plugin-registry";
 * 
 * The registry allows for:
 * - Registering new plugin types
 * - Retrieving plugin classes by name
 * 
 * This system enables SimplSite to support a flexible and extensible plugin architecture.
 * 
 * @module
 */

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