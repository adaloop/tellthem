import { ChannelConfig, ServiceConfig, TyBusConfig } from './types/main.js'
import { Channel } from './channel.js'

export class TyBus<KnownServices extends Record<string, ServiceConfig>> {
  readonly #defaultServiceName: keyof KnownServices | undefined
  readonly #services: KnownServices

  constructor(config: TyBusConfig<KnownServices>) {
    this.#defaultServiceName = config.default
    this.#services = config.services
  }

  channel<Payload>(config: ChannelConfig<KnownServices, Payload>): Channel<KnownServices, Payload> {
    return new Channel<KnownServices, Payload>(this, config)
  }
}
