import { BusConfig } from './types/bus.js'
import { OnFailHandler, Serializable, SubscribeHandler } from './types/main.js'
import { TellThem } from './tell_them.js'
import { ChannelConfig } from './types/channel.js'
import { Encoder } from './types/encoder.js'
import { Bus } from './bus.js'
import { E_FAILED_CREATE_BUS } from './errors.js'

export class Channel<KnownBuses extends Record<string, BusConfig>, Payload extends Serializable> {
  readonly #manager: TellThem<KnownBuses>

  readonly #defaultBusName?: keyof KnownBuses
  readonly name: string
  readonly encoder: Encoder<Payload>

  constructor(manager: TellThem<KnownBuses>, config: ChannelConfig<KnownBuses, Payload>) {
    this.#manager = manager

    this.#defaultBusName = config.defaultBus
    this.name = config.name
    this.encoder = config.encoder
  }

  use(busName?: keyof KnownBuses): ChannelAction<KnownBuses, Payload> {
    let bus: Bus | null = null

    if (busName) {
      bus = this.#manager.getBus(busName)
    } else if (this.#defaultBusName) {
      bus = this.#manager.getBus(this.#defaultBusName)
    } else if (this.#manager.defaultBusName) {
      bus = this.#manager.getBus(this.#manager.defaultBusName)
    }

    if (!bus) {
      throw new E_FAILED_CREATE_BUS()
    }

    return new ChannelAction<KnownBuses, Payload>(bus, this)
  }

  subscribe(handler: SubscribeHandler<Payload>) {
    return this.use().subscribe(handler)
  }

  publish(payload: Payload) {
    return this.use().publish(payload)
  }

  unsubscribe() {
    return this.use().unsubscribe()
  }
}

class ChannelAction<KnownBuses extends Record<string, BusConfig>, Payload extends Serializable> {
  readonly #bus: Bus
  readonly #channel: Channel<KnownBuses, Payload>

  constructor(bus: Bus, channel: Channel<KnownBuses, Payload>) {
    this.#bus = bus
    this.#channel = channel
  }

  publish(payload: Payload) {
    return this.#bus.publish(this.#channel.name, this.#channel.encoder, { payload })
  }

  async subscribe(handler: SubscribeHandler<Payload>): Promise<Subscription> {
    const subscription = new Subscription()

    await this.#bus.subscribe(
      this.#channel.name,
      this.#channel.encoder,
      (message) => handler(message.payload),
      subscription
    )

    return subscription
  }

  unsubscribe() {
    return this.#bus.unsubscribe(this.#channel.name)
  }
}

export class Subscription {
  onFailHandler?: OnFailHandler

  onFail(handler: OnFailHandler) {
    this.onFailHandler = handler
  }
}
