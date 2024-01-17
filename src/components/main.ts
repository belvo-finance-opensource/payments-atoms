import BelvoPaymentsGrid from '@/components/paymentsGrid/BelvoPaymentsGrid.ce.vue'
import BelvoPaymentsAtomsOptions from '@/services/options/BelvoPaymentsAtomsOptions'
import type { InitializationOptions } from '@/types/lib'
import { defineWebComponents, type Component } from '@/utils/webComponents/webComponentsUtils'

export * from '@/types/lib'

export default {
  init: (options: InitializationOptions) => {
    BelvoPaymentsAtomsOptions.getInstance(options)

    defineWebComponents([{ name: 'belvo-payments-grid', setup: BelvoPaymentsGrid as Component }])
  }
}
