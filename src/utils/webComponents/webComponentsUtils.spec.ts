import { Component, defineWebComponent, defineWebComponents } from './webComponentsUtils'

describe('webComponentsUtils', () => {
  describe('defineWebComponent', () => {
    it('should define a custom element if it does not exist', () => {
      const mockComponent: Component = {} as Component
      defineWebComponent('my-component', mockComponent)

      expect(customElements.get('my-component')).toBeDefined()
    })
  })

  describe('defineWebComponents', () => {
    it('should define multiple custom elements', () => {
      const mockComponents = [
        { name: 'component-1', setup: {} as Component },
        { name: 'component-2', setup: {} as Component }
      ]
      defineWebComponents(mockComponents)

      expect(customElements.get('component-1')).toBeDefined()
      expect(customElements.get('component-2')).toBeDefined()
    })

    it('should not define elements with the same name', () => {
      const mockComponents = [
        { name: 'component-3', setup: {} as Component },
        { name: 'component-3', setup: {} as Component },
        { name: 'component-4', setup: {} as Component }
      ]
      defineWebComponents(mockComponents)

      expect(customElements.get('component-3')).toBeDefined()
      expect(customElements.get('component-4')).toBeDefined()
    })
  })
})
