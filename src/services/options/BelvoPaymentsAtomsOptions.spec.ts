import BelvoPaymentsAtomsOptions from './BelvoPaymentsAtomsOptions'

describe('BelvoPaymentsAtomsOptions', () => {
  beforeEach(() => {
    BelvoPaymentsAtomsOptions.resetInstance()
  })

  it('should return an instance of BelvoPaymentsAtomsOptions', () => {
    const options = {
      bankShortcuts: {
        callback: vi.fn()
      }
    }
    const instance = BelvoPaymentsAtomsOptions.getInstance(options)

    expect(instance).toBeInstanceOf(BelvoPaymentsAtomsOptions)
  })

  it('should always return the same instance', () => {
    const options = {
      bankShortcuts: {
        callback: () => {}
      }
    }
    const newOptions = {
      bankShortcuts: {
        callback: () => {}
      }
    }
    const instance = BelvoPaymentsAtomsOptions.getInstance(options)
    const instance2 = BelvoPaymentsAtomsOptions.getInstance(newOptions)

    expect(instance2).toBe(instance)
    expect(instance2.options).toBe(options)
  })

  it('should reset the instance', () => {
    const options = {
      bankShortcuts: {
        callback: () => {}
      }
    }
    const instance = BelvoPaymentsAtomsOptions.getInstance(options)
    const instance2 = BelvoPaymentsAtomsOptions.resetInstance()

    expect(instance2).not.toBe(instance)
  })
})
