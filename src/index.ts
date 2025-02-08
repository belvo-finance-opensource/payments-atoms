import BelvoPaymentsAtomsOptions from '@/services/options/BelvoPaymentsAtomsOptions'
import type { InitializationOptions } from '@/types/lib'
import { isWebAuthnSupported, login, register, signals } from './services/pix/BelvoPaymentsAtomsPix'
import { registerWebComponents } from './webComponents'

// Export Vue Components separately
export * from '@/types/components'
export * from '@/types/errors'
export * from '@/types/lib'
export { default as belvoComponents } from './components'

export default {
  init: (options: InitializationOptions) => {
    BelvoPaymentsAtomsOptions.getInstance(options)
    registerWebComponents()
  },
  biometricPix: {
    collectEnrollmentInformation: signals,
    requestEnrollmentConfirmation: register,
    authorizePayment: login,
    isWebAuthnSupported
  }
}
