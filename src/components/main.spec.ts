import BelvoPaymentsGrid from '@/components/paymentsGrid/BelvoPaymentsGrid.ce.vue'
import BelvoPaymentsAtomsOptions from '@/services/options/BelvoPaymentsAtomsOptions'
import { login, register, signals } from '@/services/pix/BelvoPaymentsAtomsPix'
import { defineWebComponents } from '@/utils/webComponents/webComponentsUtils'
import BelvoPaymentsAtoms, { InitializationOptions } from './main'

vitest.mock('@/services/options/BelvoPaymentsAtomsOptions')
vitest.mock('@/utils/webComponents/webComponentsUtils')

describe('main.spec.ts', () => {
  describe('init', () => {
    it('should initialize BelvoPaymentsAtomsOptions', () => {
      const mockInitOptions = {
        bankShortcuts: {
          callback: vitest.fn()
        }
      } as unknown as InitializationOptions
      BelvoPaymentsAtoms.init(mockInitOptions)

      expect(BelvoPaymentsAtomsOptions.getInstance).toHaveBeenCalledWith(mockInitOptions)
    })

    it('should define web components', () => {
      const mockInitOptions = {
        bankShortcuts: {
          callback: vitest.fn()
        }
      } as unknown as InitializationOptions
      BelvoPaymentsAtoms.init(mockInitOptions)

      expect(defineWebComponents).toHaveBeenCalledWith([
        { name: 'belvo-payments-grid', setup: BelvoPaymentsGrid }
      ])
    })
  })

  describe('biometricPix', () => {
    it('should return signals and register', () => {
      expect(BelvoPaymentsAtoms.biometricPix).toEqual({
        collectEnrollmentInformation: signals,
        requestEnrollmentConfirmation: register,
        authorizePayment: login
      })
    })
  })
})
