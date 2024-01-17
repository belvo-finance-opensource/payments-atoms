import { ARG_TYPES_CATEGORIES, getArgsByCategory, setArgTypesCategory } from './storybookUtils'

describe('storybookUtils', () => {
  describe('setArgTypesCategory', () => {
    it('should set the category for each arg', () => {
      const args = { arg1: {}, arg2: {} }

      expect(setArgTypesCategory(args, ARG_TYPES_CATEGORIES.PROPS)).toEqual({
        arg1: { name: 'arg1', table: { category: ARG_TYPES_CATEGORIES.PROPS } },
        arg2: { name: 'arg2', table: { category: ARG_TYPES_CATEGORIES.PROPS } }
      })
    })
  })

  describe('getArgsByCategory', () => {
    it('should return args by category', () => {
      const args = {
        arg1: 'value1',
        arg2: 'value2',
        arg3: 'value3',
        arg4: 'value4'
      }
      const argTypes = {
        arg1: { table: { category: ARG_TYPES_CATEGORIES.PROPS } },
        arg2: { table: { category: ARG_TYPES_CATEGORIES.CSS_VARIABLES } },
        arg3: { table: { category: ARG_TYPES_CATEGORIES.PROPS } },
        arg4: { table: { category: ARG_TYPES_CATEGORIES.CSS_VARIABLES } }
      }

      expect(getArgsByCategory(args, argTypes, ARG_TYPES_CATEGORIES.PROPS)).toEqual({
        arg1: 'value1',
        arg3: 'value3'
      })
    })
  })
})
