import { Driver, ServiceConfig } from './types/main.js'
import { Channel } from './channel.js'

export class Bus<KnownServices extends Record<string, ServiceConfig>, Payload> {
  readonly #driver: Driver

  constructor(driver: Driver) {
    this.#driver = driver
  }

  subscribe(channel: Channel<KnownServices, Payload>, handler: (payload: Payload) => void) {}

  publish(channel: Channel<KnownServices, Payload>, payload: Payload) {}
}
