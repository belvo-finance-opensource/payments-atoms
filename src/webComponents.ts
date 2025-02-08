/**
 * This file is used to dynamically import all custom elements from the `features/` directory.
 * It is used to avoid having to import each component manually.
 */
import { Component, defineWebComponents } from '@/utils/webComponents/webComponentsUtils'

const customElementComponents: Record<string, Component> = import.meta.glob(
  './features/**/components/*.ce.vue',
  { eager: true }
)

export function registerWebComponents() {
  const componentsToDefine = Object.entries(customElementComponents).map(([path, component]) => {
    const componentName = path.split('/').slice(-1)[0].replace('.ce.vue', '')
    return { name: componentName, setup: component.default }
  })

  defineWebComponents(componentsToDefine)
}
