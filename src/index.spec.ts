import BelvoPaymentsAtoms, { InitializationOptions } from '@/index'
import BelvoPaymentsAtomsOptions from '@/sdk/options/BelvoPaymentsAtomsOptions'
import BelvoPaymentsGrid from '@/sdk/payments-grid/component/BelvoPaymentsGrid.ce.vue'
import { mount } from '@vue/test-utils'

describe('index.ts', () => {
  describe('BelvoPaymentsAtoms.init()', () => {
    beforeEach(() => {
      BelvoPaymentsAtomsOptions.resetInstance()
    })

    it('should allow components to access the options', () => {
      const mockCallback = vitest.fn()
      const mockInitOptions = {
        bankShortcuts: {
          callback: mockCallback
        }
      } as unknown as InitializationOptions

      BelvoPaymentsAtoms.init(mockInitOptions)

      const wrapper = mount(BelvoPaymentsGrid)
      wrapper.find('li').trigger('click')

      expect(mockCallback).toHaveBeenCalled()
    })

    it('should register web components successfully', () => {
      const mockInitOptions = {
        bankShortcuts: {
          callback: vitest.fn()
        }
      } as unknown as InitializationOptions

      BelvoPaymentsAtoms.init(mockInitOptions)

      const element = document.createElement('belvo-payments-grid')
      document.body.appendChild(element)

      expect(customElements.get('belvo-payments-grid')).toBeDefined()
    })
  })

  describe('SDK Contract', () => {
    it('should expose the correct contract', () => {
      expect(BelvoPaymentsAtoms).toMatchObject({
        init: expect.any(Function),
        biometricPix: {
          collectEnrollmentInformation: expect.any(Function),
          requestEnrollmentConfirmation: expect.any(Function),
          authorizePayment: expect.any(Function),
          isWebAuthnSupported: expect.any(Function)
        }
      })
    })
  })
})
