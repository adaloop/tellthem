import { Driver, DriverFactory } from '../types/driver.js'
import { ChannelMessageSubscribeHandler, Serializable } from '../types/main.js'
import { Encoder } from '../types/encoder.js'
import { ChannelMessage } from '../types/channel.js'
import { Subscription } from '../channel.js'

export function memory(): DriverFactory {
  return () => new MemoryDriver()
}

export class MemoryDriver implements Driver {
  static #subscriptions: Map<
    string,
    Array<{
      handler: ChannelMessageSubscribeHandler<any>
    }>
  > = new Map()

  async init() {}

  async publish<T extends Serializable>(
    channel: string,
    _encoder: Encoder<T>,
    message: ChannelMessage<T>
  ) {
    const handlers = MemoryDriver.#subscriptions.get(channel)

    if (!handlers) return

    for (const { handler } of handlers) {
      handler(message)
    }
  }

  async subscribe<T extends Serializable>(
    channel: string,
    _encoder: Encoder<T>,
    handler: ChannelMessageSubscribeHandler<T>,
    _subscription: Subscription
  ) {
    const handlers = MemoryDriver.#subscriptions.get(channel) || []

    handlers.push({ handler })

    MemoryDriver.#subscriptions.set(channel, handlers)
  }

  async unsubscribe(channel: string) {
    MemoryDriver.#subscriptions.delete(channel)
  }

  async disconnect() {
    MemoryDriver.#subscriptions.clear()
  }

  onReconnect(_callback: () => void) {}
}
