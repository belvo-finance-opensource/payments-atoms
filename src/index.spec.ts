import BelvoPaymentsAtomsOptions from '@/services/options/BelvoPaymentsAtomsOptions'
import { isWebAuthnSupported, login, register, signals } from '@/services/pix/BelvoPaymentsAtomsPix'
import type { InitializationOptions } from '@/types/lib'
import BelvoPaymentsAtoms from '.'
import { registerWebComponents } from './webComponents'

vitest.mock('@/services/options/BelvoPaymentsAtomsOptions')
vitest.mock('@/webComponents')

describe('index.ts', () => {
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

    it('should register web components', () => {
      const mockInitOptions = {
        bankShortcuts: {
          callback: vitest.fn()
        }
      } as unknown as InitializationOptions
      BelvoPaymentsAtoms.init(mockInitOptions)

      expect(registerWebComponents).toHaveBeenCalled()
    })
  })

  describe('biometricPix', () => {
    it('should return signals and register', () => {
      expect(BelvoPaymentsAtoms.biometricPix).toEqual({
        collectEnrollmentInformation: signals,
        requestEnrollmentConfirmation: register,
        authorizePayment: login,
        isWebAuthnSupported
      })
    })
  })
})
