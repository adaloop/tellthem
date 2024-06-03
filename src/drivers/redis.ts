import { Driver, ServiceConfig, SubscribeHandler } from '../types/main.js'
import { Channel } from '../channel.js'
import { Redis, RedisOptions } from 'ioredis'

export function redis(config: RedisDriverConfig | string) {
  return () => new RedisDriver(config)
}

interface RedisDriverConfig extends RedisOptions {}

export class RedisDriver implements Driver {
  readonly #publisher: Redis
  readonly #subscriber: Redis

  constructor(config: RedisDriverConfig | string) {
    // @ts-expect-error - merged definitions of overloaded constructor is not public
    this.#publisher = new Redis(config)
    // @ts-expect-error - merged definitions of overloaded constructor is not public
    this.#subscriber = new Redis(config)
  }

  async publish<KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>,
    payload: Payload
  ) {
    const encoded = channel.encoder.encode({ payload })
    await this.#publisher.publish(channel.name, encoded)
  }

  async subscribe<KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>,
    handler: SubscribeHandler<Payload>
  ) {
    this.#subscriber.subscribe(channel.name, (err) => {
      if (err) {
        throw err
      }
    })

    this.#subscriber.on('message', (receivedChannel: string, message: string) => {
      if (channel.name !== receivedChannel) return

      const decoded = channel.encoder.decode(message)

      if (!decoded) {
        // TODO - on fail
        return
      }

      handler(decoded.payload)
    })
  }

  async unsubscribe<KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>
  ) {
    await this.#subscriber.unsubscribe(channel.name)
  }

  async disconnect() {
    this.#publisher.disconnect()
    this.#subscriber.disconnect()
  }

  onReconnect(_callback: () => void) {
    this.#subscriber.on('reconnecting', _callback)
  }
}
