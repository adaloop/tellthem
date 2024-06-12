import { Driver, DriverFactory } from '../types/driver.js'
import { ChannelMessageSubscribeHandler, Serializable } from '../types/main.js'
import { Encoder } from '../types/encoder.js'
import { ChannelMessage } from '../types/channel.js'
import { Subscription } from '../channel.js'
import { connect, IClientOptions, MqttClient } from 'mqtt'
import debug from '../utils/debug.js'
import { E_FAILED_DECODE_MESSAGE, E_SUBSCRIPTION_FAILED } from '../errors.js'

interface MqttDriverConfig {
  protocol?: 'mqtt' | 'mqtts'
  host: string
  port?: number
  options?: IClientOptions
}

export function mqtt(config: MqttDriverConfig): DriverFactory {
  return () => new MqttDriver(config)
}

export class MqttDriver implements Driver {
  readonly #client: MqttClient

  constructor(config: MqttDriverConfig) {
    config.protocol = config.protocol || 'mqtt'
    config.port = config.port || 1883

    const connectionString = `${config.protocol}://${config.host}:${config.port}`

    this.#client = connect(connectionString, config.options)
  }

  async init() {}

  async publish<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    message: ChannelMessage<T>
  ) {
    const encoded = encoder.encode(message)
    await this.#client.publishAsync(channel, encoded)
  }

  async subscribe<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    handler: ChannelMessageSubscribeHandler<T>,
    subscription: Subscription
  ) {
    this.#client.subscribe(channel, (err) => {
      if (err && subscription.onFailHandler) {
        subscription.onFailHandler(new E_SUBSCRIPTION_FAILED())
      }
    })

    this.#client.on('message', async (receivedChannel: string, message: Buffer | string) => {
      if (receivedChannel !== channel) return

      debug('received message for channel "%s"', channel)

      const decoded = await encoder.decode(message.toString())

      if (!decoded) {
        if (subscription.onFailHandler) {
          subscription.onFailHandler(new E_FAILED_DECODE_MESSAGE())
        }

        return
      }

      handler(decoded)
    })
  }

  async unsubscribe(channel: string) {
    await this.#client.unsubscribeAsync(channel)
  }

  async disconnect() {
    await this.#client.endAsync()
  }

  onReconnect(_callback: () => void) {}
}
