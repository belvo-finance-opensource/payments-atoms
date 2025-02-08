import type { Component } from '@/sdk/types/components'
import { defineCustomElement } from 'vue'

/**
 * Manually defines a single web component.
 */
function defineWebComponent(name: string, setup: () => Component) {
  if (customElements.get(name)) return

  const customElement = defineCustomElement(setup())
  customElements.define(name, customElement)
}

/**
 * Manually defines multiple web components.
 */
export function defineWebComponents(components: { name: string; setup: () => Component }[]) {
  components.forEach(({ name, setup }) => {
    defineWebComponent(name, setup)
  })
}

/**
 * Automatically defines all web components by reading define.ts files.
 */
export function defineAllWebComponents() {
  // Auto-import all definitions
  const importedModules: Record<string, { default: { name: string; setup: () => Component } }> =
    import.meta.glob('../features/**/define.ts', { eager: true })

  const components = Object.values(importedModules).map((module) => module.default)
  defineWebComponents(components)
}
