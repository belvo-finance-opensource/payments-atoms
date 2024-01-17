import type { InitializationOptions } from '@/types/lib'

export default class BelvoPaymentsAtomsOptions {
  private static _instance: BelvoPaymentsAtomsOptions | null

  private _options?: InitializationOptions

  private constructor(options?: InitializationOptions) {
    this._options = options
  }

  public static getInstance(options?: InitializationOptions): BelvoPaymentsAtomsOptions {
    if (!BelvoPaymentsAtomsOptions._instance) {
      BelvoPaymentsAtomsOptions._instance = new BelvoPaymentsAtomsOptions(options)
    }

    return BelvoPaymentsAtomsOptions._instance
  }

  public static resetInstance() {
    this._instance = null
  }

  public get options() {
    return this._options
  }
}
