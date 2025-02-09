import BelvoPaymentsAtoms from '@/index'
import { action } from '@storybook/addon-actions'

import './styles.css'

BelvoPaymentsAtoms.init({
  bankShortcuts: { callback: action('bankShortcuts') }
})
