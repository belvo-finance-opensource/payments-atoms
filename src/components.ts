/**
 * This file is used to dynamically import all Vue components from the `features/` directory.
 * It is used to avoid having to import each component manually.
 */
import { Component } from './utils/webComponents/webComponentsUtils'

const vueComponents: Record<string, Component> = import.meta.glob(
  './features/**/components/*.{vue,ce.vue}',
  { eager: true }
)

const exportedComponents: Record<string, Component> = {}

Object.entries(vueComponents).forEach(([path, component]) => {
  const componentName = path
    .split('/')
    .slice(-1)[0]
    .replace(/\.(ce\.)?vue$/, '') // Clean .vue and .ce.vue
  exportedComponents[componentName] = component.default
})

export default exportedComponents
