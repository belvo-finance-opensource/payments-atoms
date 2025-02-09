import {
  isWebAuthnSupported,
  login,
  register,
  signals
} from '@/sdk/biometric-payments/BelvoPaymentsAtomsPix'
import BelvoPaymentsAtomsOptions from '@/sdk/options/BelvoPaymentsAtomsOptions'
import type { InitializationOptions } from '@/types/lib'
import { defineAllWebComponents, defineWebComponents } from '@/utils/webComponents'

// Vue Components
export { default as BelvoPaymentsGrid } from './sdk/payments-grid'

// Types
export * from '@/types/errors'
export * from '@/types/lib'

export default {
  init: (options: InitializationOptions) => {
    BelvoPaymentsAtomsOptions.getInstance(options)

    if (options.defineWebComponents) {
      defineWebComponents(options.defineWebComponents)
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
