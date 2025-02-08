import {
  isWebAuthnSupported,
  login,
  register,
  signals
} from '@/features/biometric-payments/BelvoPaymentsAtomsPix'
import BelvoPaymentsAtomsOptions from '@/features/options/BelvoPaymentsAtomsOptions'
import type { InitializationOptions } from '@/types/lib'
import { defineAllWebComponents, defineWebComponents } from './sdk/webComponents'

// Export Vue Components separately
export * from '@/types/components'
export * from '@/types/errors'
export * from '@/types/lib'
export { default as BelvoPaymentsGrid } from './features/payments-grid'

export default {
  init: (options: InitializationOptions) => {
    BelvoPaymentsAtomsOptions.getInstance(options)

    if (options.defineWebComponents) {
      if (!options.defineWebComponents.components) {
        throw new Error('component list is required when defineWebComponents is set')
      }

      defineWebComponents(options.defineWebComponents.components)
    } else {
      defineAllWebComponents()
    }
  },
  biometricPix: {
    collectEnrollmentInformation: signals,
    requestEnrollmentConfirmation: register,
    authorizePayment: login,
    isWebAuthnSupported
  }
}
