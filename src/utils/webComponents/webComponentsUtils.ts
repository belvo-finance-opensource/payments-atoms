import { defineCustomElement, type DefineComponent } from 'vue'

export type Component = DefineComponent<{}, {}, any> // eslint-disable-line

export const defineWebComponent = (componentName: string, componentSetup: Component) => {
  if (customElements.get(componentName)) return

  const customElement = defineCustomElement(componentSetup)
  customElements.define(componentName, customElement)
}

export const defineWebComponents = (components: { name: string; setup: Component }[]) => {
  components.forEach((component) => {
    defineWebComponent(component.name, component.setup)
  })
}
