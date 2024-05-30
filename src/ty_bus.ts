import { Driver, TyBusConfig } from './types/main.js'

export class TyBus<KnownDrivers extends Record<string, Driver>> {
  readonly #defaultDriverName: keyof KnownDrivers | undefined
  readonly #drivers: KnownDrivers

  constructor(config: TyBusConfig<KnownDrivers>) {
    this.#defaultDriverName = config.default
    this.#drivers = config.drivers
  }

  createQueue() {
    console.log(this.#defaultDriverName)
    console.log(this.#drivers)
  }
}
