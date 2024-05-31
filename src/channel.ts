import { ChannelConfig, ChannelEncoder, ServiceConfig, SubscribeHandler } from './types/main.js'
import { TyBus } from './ty_bus.js'
import { Bus } from './bus.js'
import { RuntimeException } from '@poppinss/utils'

export class Channel<KnownServices extends Record<string, ServiceConfig>, Payload> {
  readonly #tyBus: TyBus<KnownServices>

  readonly #defaultServiceName?: keyof KnownServices
  readonly name: string
  readonly encoder: ChannelEncoder<Payload>

  constructor(tyBus: TyBus<KnownServices>, config: ChannelConfig<KnownServices, Payload>) {
    this.#tyBus = tyBus

    this.#defaultServiceName = config.defaultService
    this.name = config.name
    this.encoder = config.encoder
  }

  use(serviceName?: keyof KnownServices): ChannelAction<KnownServices, Payload> {
    let bus: Bus<KnownServices, Payload> | null = null

    if (serviceName) {
      bus = this.#tyBus.getBus<Payload>(serviceName)
    }

    if (this.#defaultServiceName) {
      bus = this.#tyBus.getBus<Payload>(this.#defaultServiceName)
    }

    if (this.#tyBus.defaultServiceName) {
      bus = this.#tyBus.getBus<Payload>(this.#tyBus.defaultServiceName)
    }

    if (!bus) {
      throw new RuntimeException('Cannot create an instance of bus. No default bus is specified')
    }

    return new ChannelAction<KnownServices, Payload>(this, bus)
  }

  subscribe(callback: (payload: Payload) => void) {
    return this.use().subscribe(callback)
  }

  publish(payload: Payload) {
    return this.use().publish(payload)
  }
}

class ChannelAction<KnownServices extends Record<string, ServiceConfig>, Payload> {
  readonly #channel: Channel<KnownServices, Payload>
  readonly #bus: Bus<KnownServices, Payload>

  constructor(channel: Channel<KnownServices, Payload>, bus: Bus<KnownServices, Payload>) {
    this.#channel = channel
    this.#bus = bus
  }

  publish(payload: Payload) {
    this.#bus.publish(this.#channel, payload)
  }

  subscribe(handler: SubscribeHandler<Payload>) {
    this.#bus.subscribe(this.#channel, handler)
  }
}
