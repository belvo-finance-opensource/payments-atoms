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
  bankShortcuts: {
    callback: Callback
  }
}
