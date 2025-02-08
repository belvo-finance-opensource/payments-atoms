import type { Component } from '@/sdk/types/components'
import { defineWebComponents } from './webComponents'

describe('webComponentsUtils', () => {
  const mockComponent: Component = {} as Component

  describe('defineWebComponent', () => {
    it('should define a custom element if it does not exist', () => {
      defineWebComponents([{ name: 'my-component', setup: () => mockComponent }])

      expect(customElements.get('my-component')).toBeDefined()
    })
  })

  describe('defineWebComponents', () => {
    it('should define multiple custom elements', () => {
      const mockComponents = [
        { name: 'component-1', setup: () => mockComponent },
        { name: 'component-2', setup: () => mockComponent }
      ]
      defineWebComponents(mockComponents)

      expect(customElements.get('component-1')).toBeDefined()
      expect(customElements.get('component-2')).toBeDefined()
    })

    it('should not define elements with the same name', () => {
      const mockComponents = [
        { name: 'component-3', setup: () => mockComponent },
        { name: 'component-3', setup: () => mockComponent },
        { name: 'component-4', setup: () => mockComponent }
      ]
      defineWebComponents(mockComponents)

      expect(customElements.get('component-3')).toBeDefined()
      expect(customElements.get('component-4')).toBeDefined()
    })
  })
})
