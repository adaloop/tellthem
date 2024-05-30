import { ChannelConfig, ChannelEncoder, ServiceConfig } from './types/main.js'
import { TyBus } from './ty_bus.js'

export class Channel<KnownServices extends Record<string, ServiceConfig>, Payload> {
  readonly #tyBus: TyBus<KnownServices>

  readonly #name: string
  readonly #defaultServiceName?: keyof KnownServices
  readonly #encoder: ChannelEncoder<Payload>

  constructor(tyBus: TyBus<KnownServices>, config: ChannelConfig<KnownServices, Payload>) {
    this.#tyBus = tyBus

    this.#name = config.name
    this.#defaultServiceName = config.defaultService
    this.#encoder = config.encoder
  }

  use(serviceName?: keyof KnownServices) {}

  subscribe(callback: (payload: Payload) => void) {}

  publish(payload: Payload) {}
}
