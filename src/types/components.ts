import BelvoPaymentsGrid from '@/components/paymentsGrid/BelvoPaymentsGrid.ce.vue'
import { ReactAttributes } from './utils'

declare module 'vue' {
  export interface GlobalComponents {
    BelvoPaymentsGrid: typeof BelvoPaymentsGrid
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'belvo-payments-grid': ReactAttributes<typeof BelvoPaymentsGrid>
    }
  }
}
