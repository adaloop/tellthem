import { BusConfig } from './types/bus.js'
import { TellThemConfig } from './types/tell_them.js'
import { Bus } from './bus.js'
import { ChannelConfig } from './types/channel.js'
import { Serializable } from './types/main.js'
import { Channel, Subscription } from './channel.js'
import { E_FAILED_CREATE_BUS } from './errors.js'
import { Encoder } from './types/encoder.js'

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

  use(busName?: keyof KnownBuses): TellThemAction {
    let bus: Bus | null = null

    if (busName) {
      bus = this.getBus(busName)
    } else if (this.defaultBusName) {
      bus = this.getBus(this.defaultBusName)
    }

    if (!bus) {
      throw new E_FAILED_CREATE_BUS()
    }

    return new TellThemAction(bus)
  }

  publish<Payload extends Serializable>(
    channel: string,
    encoder: Encoder<Payload>,
    message: Payload
  ): Promise<void> {
    return this.use().publish(channel, encoder, message)
  }

  subscribe<Payload extends Serializable>(
    channel: string,
    encoder: Encoder<Payload>,
    handler: (message: Payload) => void
  ): Promise<Subscription> {
    return this.use().subscribe(channel, encoder, handler)
  }

  unsubscribe(channel: string): Promise<void> {
    return this.use().unsubscribe(channel)
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

class TellThemAction {
  readonly #bus: Bus

  constructor(bus: Bus) {
    this.#bus = bus
  }

  publish<Payload extends Serializable>(
    channel: string,
    encoder: Encoder<Payload>,
    message: Payload
  ): Promise<void> {
    return this.#bus.publish(channel, encoder, { payload: message })
  }

  async subscribe<Payload extends Serializable>(
    channel: string,
    encoder: Encoder<Payload>,
    handler: (message: Payload) => void
  ): Promise<Subscription> {
    const subscription = new Subscription()
    await this.#bus.subscribe(channel, encoder, (message) => handler(message.payload), subscription)
    return subscription
  }

  unsubscribe(channel: string): Promise<void> {
    return this.#bus.unsubscribe(channel)
  }
}
