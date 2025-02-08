import institutionsData from '@/data/institutions.json'
import BelvoPaymentsAtomsOptions from '@/features/options/BelvoPaymentsAtomsOptions'
import { Institutions } from '@/types/lib'
import { ComponentProps } from '@/types/utils'
import { mount } from '@vue/test-utils'
import BelvoPaymentsGrid from './BelvoPaymentsGrid.ce.vue'

const institutions = institutionsData as Institutions

type BelvoPaymentsGridProps = ComponentProps<typeof BelvoPaymentsGrid>

const mountComponent = (props?: BelvoPaymentsGridProps) => mount(BelvoPaymentsGrid, { props })

describe('BelvoPaymentsGrid', () => {
  beforeEach(() => {
    BelvoPaymentsAtomsOptions.resetInstance()
  })

  it('should render component correctly with default props', () => {
    const wrapper = mountComponent()

    const institutionsListItems = wrapper.findAll('.belvo-payments-grid li')
    const institutionsListItemsImgs = wrapper.findAll('.belvo-payments-grid li img')

    expect(institutionsListItems.length).toBe(institutions['COL'].length + 1)
    expect(institutionsListItemsImgs.length).toBe(institutions['COL'].length)
    expect(institutionsListItems[0].text()).toBe(institutions['COL'][0].display_name)
    expect(institutionsListItems[0].classes().length).toBe(1)
    expect(institutionsListItems[1].text()).toBe(institutions['COL'][1].display_name)
    expect(institutionsListItems[1].classes().length).toBe(1)
    expect(institutionsListItems[2].text()).toBe(institutions['COL'][2].display_name)
    expect(institutionsListItems[2].classes().length).toBe(1)
    expect(institutionsListItems[3].text()).toBe('Another institution')
    expect(institutionsListItems[3].classes().length).toBe(2)
  })

  it('should render component correctly with country prop', () => {
    const wrapper = mountComponent({ country: 'BRA' })

    const institutionsListItems = wrapper.findAll('.belvo-payments-grid li')
    const institutionsListItemsImgs = wrapper.findAll('.belvo-payments-grid li img')

    expect(institutionsListItems.length).toBe(institutions['BRA'].length + 1)
    expect(institutionsListItemsImgs.length).toBe(institutions['BRA'].length)
    expect(institutionsListItems[0].text()).toBe(institutions['BRA'][0].display_name)
    expect(institutionsListItems[1].text()).toBe(institutions['BRA'][1].display_name)
    expect(institutionsListItems[2].text()).toBe(institutions['BRA'][2].display_name)
    expect(institutionsListItems[3].text()).toBe(institutions['BRA'][3].display_name)
    expect(institutionsListItems[4].text()).toBe(institutions['BRA'][4].display_name)
    expect(institutionsListItems[5].text()).toBe('Another institution')
  })

  it('should render component correctly with anotherInstitutionText prop', () => {
    const wrapper = mountComponent({ anotherInstitutionText: 'Otra institución' })

    const institutionsListItems = wrapper.findAll('.belvo-payments-grid li')

    expect(institutionsListItems[3].text()).toBe('Otra institución')
  })

  it('should handle institution selection correctly if there is no callback', async () => {
    const belvoPaymentsAtomsOptions = BelvoPaymentsAtomsOptions.getInstance()

    const wrapper = mountComponent()

    const institutionsListItems = wrapper.findAll('.belvo-payments-grid li')
    await institutionsListItems[3].trigger('click')

    expect(institutionsListItems[0].classes().length).toBe(1)
    expect(institutionsListItems[1].classes().length).toBe(1)
    expect(institutionsListItems[2].classes().length).toBe(1)
    expect(institutionsListItems[3].classes().length).toBe(3)
    expect(belvoPaymentsAtomsOptions.options).toBe(undefined)
  })

  it('should handle institution selection correctly', async () => {
    const callbackMock = vitest.fn()
    BelvoPaymentsAtomsOptions.getInstance({
      pix: {
        credentials: {
          signUp: () => {},
          signIn: () => {}
        }
      },
      bankShortcuts: {
        callback: callbackMock
      }
    })

    const wrapper = mountComponent()

    const institutionsListItems = wrapper.findAll('.belvo-payments-grid li')
    await institutionsListItems[0].trigger('click')

    expect(institutionsListItems[0].classes().length).toBe(2)
    expect(institutionsListItems[1].classes().length).toBe(1)
    expect(institutionsListItems[2].classes().length).toBe(1)
    expect(institutionsListItems[3].classes().length).toBe(2)
    expect(callbackMock).toHaveBeenCalledTimes(1)
    expect(callbackMock).toHaveBeenCalledWith(institutions['COL'][0])
  })

  it('should handle another institution selection correctly', async () => {
    const callbackMock = vitest.fn()
    BelvoPaymentsAtomsOptions.getInstance({
      pix: {
        credentials: {
          signUp: () => {},
          signIn: () => {}
        }
      },
      bankShortcuts: {
        callback: callbackMock
      }
    })

    const wrapper = mountComponent()

    const institutionsListItems = wrapper.findAll('.belvo-payments-grid li')
    await institutionsListItems[3].trigger('click')

    expect(institutionsListItems[0].classes().length).toBe(1)
    expect(institutionsListItems[1].classes().length).toBe(1)
    expect(institutionsListItems[2].classes().length).toBe(1)
    expect(institutionsListItems[3].classes().length).toBe(3)
    expect(callbackMock).toHaveBeenCalledTimes(1)
    expect(callbackMock).toHaveBeenCalledWith(undefined)
  })
})
