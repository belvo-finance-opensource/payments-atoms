import { ArgTypes, Args } from '@storybook/vue3'

export const ARG_TYPES_CATEGORIES = {
  PROPS: 'Props',
  CSS_VARIABLES: 'CSS Variables'
} as const

type ArgTypesCategory = (typeof ARG_TYPES_CATEGORIES)[keyof typeof ARG_TYPES_CATEGORIES]

export const setArgTypesCategory = (args: Args, category: ArgTypesCategory) =>
  Object.keys(args).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        name: key,
        table: {
          category: category
        }
      }
    }),
    {}
  )

export const getArgsByCategory = (args: Args, argTypes: ArgTypes, category: ArgTypesCategory) =>
  Object.fromEntries(
    Object.entries(args).filter(([key]) => {
      return argTypes[key]?.table?.category === category
    })
  )
