import {
  ARG_TYPES_CATEGORIES,
  getArgsByCategory,
  setArgTypesCategory
} from '@/utils/storybook/storybookUtils'
import type { Meta, StoryFn } from '@storybook/vue3'
import { computed } from 'vue'

export default {
  title: 'components/BelvoPaymentsGrid'
} as Meta

const Template: StoryFn = (args, { argTypes }) => ({
  setup() {
    const props = computed(() => getArgsByCategory(args, argTypes, ARG_TYPES_CATEGORIES.PROPS))

    const cssVariables = computed(() =>
      getArgsByCategory(args, argTypes, ARG_TYPES_CATEGORIES.CSS_VARIABLES)
    )

    return { props, cssVariables }
  },
  template: `
    <div style="width: 300px;">
      <belvo-payments-grid v-bind="props" :style="cssVariables" />
    </div>
  `
})

const props = {
  country: 'COL',
  anotherInstitutionText: 'Another institution'
}

const cssVariables = {
  '--belvo-payments-grid-template-columns': 'unset',
  '--belvo-payments-grid-template-rows': 'unset',
  '--belvo-payments-grid-padding': 'unset',
  '--belvo-payments-grid-border-style': 'unset',
  '--belvo-payments-grid-border-width': 'unset',
  '--belvo-payments-grid-border-color': 'unset',
  '--belvo-payments-grid-border-radius': 'unset',
  '--belvo-payments-grid-background-color': 'unset',
  '--belvo-payments-grid-gap': 'unset',
  '--belvo-payments-grid-card-align-items': 'unset',
  '--belvo-payments-grid-card-justify-content': 'unset',
  '--belvo-payments-grid-card-cursor': 'unset',
  '--belvo-payments-grid-card-border-style': 'unset',
  '--belvo-payments-grid-card-border-width': 'unset',
  '--belvo-payments-grid-card-border-color': 'unset',
  '--belvo-payments-grid-card-border-radius': 'unset',
  '--belvo-payments-grid-card-background-color': 'unset',
  '--belvo-payments-grid-card-padding': 'unset',
  '--belvo-payments-grid-card-transition-duration': 'unset',
  '--belvo-payments-grid-card-transition-property': 'unset',
  '--belvo-payments-grid-card-transition-timing-function': 'unset',
  '--belvo-payments-grid-card-hover-box-shadow': 'unset',
  '--belvo-payments-grid-card-hover-background-color': 'unset',
  '--belvo-payments-grid-card-selected-box-shadow': 'unset',
  '--belvo-payments-grid-card-institution-text-display': 'unset',
  '--belvo-payments-grid-card-institution-text-font-family': 'unset',
  '--belvo-payments-grid-card-institution-text-font-size': 'unset',
  '--belvo-payments-grid-card-institution-text-font-weight': 'unset',
  '--belvo-payments-grid-card-institution-text-color': 'unset',
  '--belvo-payments-grid-card-institution-image-display': 'unset',
  '--belvo-payments-grid-card-institution-image-width': 'unset',
  '--belvo-payments-grid-card-institution-image-height': 'unset',
  '--belvo-payments-grid-card-institution-image-margin-right': 'unset',
  '--belvo-payments-grid-card-another-institution-justify-content': 'unset',
  '--belvo-payments-grid-card-another-institution-text-display': 'unset',
  '--belvo-payments-grid-card-another-institution-text-font-family': 'unset',
  '--belvo-payments-grid-card-another-institution-text-font-size': 'unset',
  '--belvo-payments-grid-card-another-institution-text-font-weight': 'unset',
  '--belvo-payments-grid-card-another-institution-text-color': 'unset'
}

export const Default = Template.bind({})

Default.args = {
  ...props,
  ...cssVariables
}

Default.argTypes = {
  ...setArgTypesCategory(props, ARG_TYPES_CATEGORIES.PROPS),
  ...setArgTypesCategory(cssVariables, ARG_TYPES_CATEGORIES.CSS_VARIABLES)
}
