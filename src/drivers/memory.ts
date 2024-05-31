import { Driver, ServiceConfig, SubscribeHandler } from '../types/main.js'
import { Channel } from '../channel.js'

export function memory() {
  return () => new MemoryDriver()
}

export class MemoryDriver implements Driver {
  static #subscriptions: Map<
    string,
    Array<{
      handler: SubscribeHandler<any>
    }>
  > = new Map()

  receivedMessages: any[] = []

  async publish<KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>,
    payload: Payload
  ) {
    const handlers = MemoryDriver.#subscriptions.get(channel.name)

    if (!handlers) {
      return
    }

    for (const { handler } of handlers) {
      handler(payload)
    }
  }

  async subscribe<KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>,
    handler: SubscribeHandler<Payload>
  ) {
    const handlers = MemoryDriver.#subscriptions.get(channel.name) || []

    handlers.push({ handler: this.#wrapHandler(handler) })

    MemoryDriver.#subscriptions.set(channel.name, handlers)
  }

  async unsubscribe<KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>
  ) {
    MemoryDriver.#subscriptions.set(channel.name, [])
  }

  async disconnect() {
    MemoryDriver.#subscriptions.clear()
  }

  onReconnect(_callback: () => void) {}

  #wrapHandler(handler: SubscribeHandler<any>) {
    return (message: any) => {
      this.receivedMessages.push(message)
      handler(message)
    }
  }
}
