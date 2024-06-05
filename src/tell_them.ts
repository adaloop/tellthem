import { BusConfig } from './types/bus.js'
import { TellThemConfig } from './types/tell_them.js'
import { Bus } from './bus.js'
import { ChannelConfig } from './types/channel.js'
import { Serializable } from './types/main.js'
import { Channel } from './channel.js'

export class TellThem<KnownBuses extends Record<string, BusConfig>> {
  readonly defaultBusName: keyof KnownBuses | undefined
  readonly #buses: KnownBuses

  #busesCache: Partial<Record<keyof KnownBuses, Bus>> = {}

  constructor(config: TellThemConfig<KnownBuses>) {
    this.defaultBusName = config.default
    this.#buses = config.buses
  }

  channel<Payload extends Serializable>(
    config: ChannelConfig<KnownBuses, Payload>
  ): Channel<KnownBuses, Payload> {
    return new Channel(this, config)
  }

  getBus(busName: keyof KnownBuses): Bus {
    const cachedBus = this.#busesCache[busName]

    if (cachedBus) {
      return cachedBus
    }

    const bus = new Bus(this.#buses[busName].driver())
    this.#busesCache[busName] = bus

    return bus
  }
}
