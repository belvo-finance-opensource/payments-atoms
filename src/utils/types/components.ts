import BelvoPaymentsGrid from '@/sdk/payments-grid'
import { ReactAttributes } from '@/utils/types/props'
import { DefineComponent } from 'vue'

export type BelvoComponent = DefineComponent<{}, {}, any> // eslint-disable-line

// Needed to enable type inference for our custom elements
// @see https://vuejs.org/guide/extras/web-components.html#web-components-and-typescript
declare module 'vue' {
  export interface GlobalComponents {
    BelvoPaymentsGrid: typeof BelvoPaymentsGrid
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
