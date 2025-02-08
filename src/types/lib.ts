import { Component } from '@/sdk/types/components'
import { UUID } from './utils'

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
  defineWebComponents?: {
    components: { name: string; setup: () => Component }[]
  }
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
