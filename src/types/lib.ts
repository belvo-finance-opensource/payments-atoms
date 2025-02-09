import { BelvoComponent } from '@/utils/types/components'
import { UUID } from './uuid'

export type Institution = {
  id: UUID
  display_name: string
  icon_logo: string
}

export type Institutions = {
  [key in Country]: Institution[]
}

export type Country = 'COL' | 'BRA'
export type Callback = (institution?: Institution) => void

export type InitializationOptions = {
  defineWebComponents?: { name: string; setup: () => BelvoComponent }[]
  bankShortcuts: {
    callback: Callback
  }
  pix?: {
    credentials: {
      signUp: () => void
      signIn: () => void
    }
  }
}
