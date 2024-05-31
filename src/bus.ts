import { Driver, ServiceConfig, SubscribeHandler } from './types/main.js'
import { Channel } from './channel.js'

export class Bus<KnownServices extends Record<string, ServiceConfig>, Payload> {
  readonly #driver: Driver

  constructor(driver: Driver) {
    this.#driver = driver
  }

  subscribe(channel: Channel<KnownServices, Payload>, handler: SubscribeHandler<Payload>) {
    return this.#driver.subscribe(channel, handler)
  }

  publish(channel: Channel<KnownServices, Payload>, payload: Payload) {
    return this.#driver.publish(channel, payload)
  }
}
