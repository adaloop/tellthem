import { Driver, DriverFactory } from '../types/driver.js'
import { Serializable, SubscribeHandler } from '../types/main.js'
import { Encoder } from '../types/encoder.js'
import { ChannelMessage } from '../types/channel.js'

export function memory(): DriverFactory {
  return () => new MemoryDriver()
}

export class MemoryDriver implements Driver {
  static #subscriptions: Map<
    string,
    Array<{
      handler: SubscribeHandler<any>
    }>
  > = new Map()

  async publish<T extends Serializable>(
    channel: string,
    message: ChannelMessage<T>,
    _encoder: Encoder<T>
  ) {
    const handlers = MemoryDriver.#subscriptions.get(channel)

    if (!handlers) return

    for (const { handler } of handlers) {
      handler(message)
    }
  }

  async subscribe<T extends Serializable>(
    channel: string,
    handler: SubscribeHandler<T>,
    _encoder: Encoder<T>
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
