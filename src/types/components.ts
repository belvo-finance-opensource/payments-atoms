import BelvoPaymentsGrid from '@/features/payments-grid/components/BelvoPaymentsGrid.ce.vue'
import { ReactAttributes } from './utils'

// Needed to enable type inference for our custom elements
// @see https://vuejs.org/guide/extras/web-components.html#web-components-and-typescript
declare module 'vue' {
  export interface GlobalComponents {
    'belvo-payments-grid': typeof BelvoPaymentsGrid
  }
}

// Needed to enable type inference for our custom elements in JSX
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'belvo-payments-grid': ReactAttributes<typeof BelvoPaymentsGrid>
    }
  }
}
