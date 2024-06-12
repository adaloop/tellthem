import { Driver, DriverFactory } from '../types/driver.js'
import { ChannelMessageSubscribeHandler, Serializable } from '../types/main.js'
import { Encoder } from '../types/encoder.js'
import { ChannelMessage } from '../types/channel.js'
import { Subscription } from '../subscription.js'

export function memory(): DriverFactory {
  return () => new MemoryDriver()
}

export class MemoryDriver implements Driver {
  static #subscriptions: Map<
    string,
    Array<{
      subscription: Subscription
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
    subscription: Subscription
  ) {
    const handlers = MemoryDriver.#subscriptions.get(channel) || []

    handlers.push({ handler, subscription })

    MemoryDriver.#subscriptions.set(channel, handlers)
  }

  async unsubscribe(target: string | Subscription) {
    if (typeof target === 'string') {
      MemoryDriver.#subscriptions.delete(target)
      return
    }

    if (target.channel) {
      const handlers = MemoryDriver.#subscriptions.get(target.channel)

      if (!handlers) return

      MemoryDriver.#subscriptions.set(
        target.channel,
        handlers.filter(({ subscription }) => subscription !== target)
      )
    }
  }

  async disconnect() {
    MemoryDriver.#subscriptions.clear()
  }

  onReconnect(_callback: () => void) {}
}
