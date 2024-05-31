import { ChannelConfig, ServiceConfig, TyBusConfig } from './types/main.js'
import { Channel } from './channel.js'
import { Bus } from './bus.js'

export class TyBus<KnownServices extends Record<string, ServiceConfig>> {
  readonly defaultServiceName: keyof KnownServices | undefined
  readonly #services: KnownServices

  #busesCache: Partial<Record<keyof KnownServices, Bus<KnownServices, unknown>>> = {}

  constructor(config: TyBusConfig<KnownServices>) {
    this.defaultServiceName = config.default
    this.#services = config.services
  }

  channel<Payload>(config: ChannelConfig<KnownServices, Payload>): Channel<KnownServices, Payload> {
    return new Channel<KnownServices, Payload>(this, config)
  }

  getBus<Payload>(serviceName: keyof KnownServices): Bus<KnownServices, Payload> {
    const cachedBus = this.#busesCache[serviceName]

    if (cachedBus) {
      return cachedBus as Bus<KnownServices, Payload>
    }

    const service = this.#services[serviceName]

    const bus = new Bus<KnownServices, Payload>(service.driver)
    this.#busesCache[serviceName] = bus as Bus<KnownServices, unknown>

    return bus
  }
}
