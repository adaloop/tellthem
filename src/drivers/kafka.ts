import { Driver, DriverFactory } from '../types/driver.js'
import { ChannelMessageSubscribeHandler, Serializable } from '../types/main.js'
import { Encoder } from '../types/encoder.js'
import { ChannelMessage } from '../types/channel.js'
import { Subscription } from '../channel.js'
import { Consumer, Kafka, KafkaConfig, Producer } from 'kafkajs'
import debug from '../utils/debug.js'
import { E_FAILED_DECODE_MESSAGE } from '../errors.js'

interface KafkaDriverConfig extends KafkaConfig {}

export function kafka(config: KafkaDriverConfig): DriverFactory {
  return () => new KafkaDriver(config)
}

export class KafkaDriver implements Driver {
  readonly #producer: Producer
  readonly #consumer: Consumer

  #subscriptions: Map<
    string,
    Array<{
      encoder: Encoder<any>
      handler: ChannelMessageSubscribeHandler<any>
      subscription: Subscription
    }>
  > = new Map()

  constructor(config: KafkaDriverConfig) {
    const kafka = new Kafka(config)

    this.#producer = kafka.producer()
    this.#consumer = kafka.consumer({ groupId: 'tellthem' })
  }

  async init() {
    await this.#producer.connect()
    await this.#consumer.connect()

    await this.#consumer.run({
      eachMessage: async ({ topic, message }) => {
        const subscriptions = this.#subscriptions.get(topic) || []

        if (!message || !message.value) {
          return
        }

        debug('received message for channel "%s"', topic)

        for (const { encoder, handler, subscription } of subscriptions) {
          const decoded = encoder.decode(message.value.toString())

          if (!decoded) {
            if (subscription.onFailHandler) {
              subscription.onFailHandler(new E_FAILED_DECODE_MESSAGE())
            }

            return
          }

          handler(decoded)
        }
      },
    })
  }

  async publish<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    message: ChannelMessage<T>
  ) {
    const encoded = encoder.encode(message)

    await this.#producer.send({
      topic: channel,
      messages: [
        {
          key: channel,
          value: encoded,
        },
      ],
    })
  }

  async subscribe<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    handler: ChannelMessageSubscribeHandler<T>,
    subscription: Subscription
  ) {
    const subscriptions = this.#subscriptions.get(channel) || []

    subscriptions.push({
      encoder,
      handler,
      subscription,
    })

    this.#subscriptions.set(channel, subscriptions)
  }

  async unsubscribe(channel: string) {
    this.#subscriptions.delete(channel)
  }

  async disconnect() {
    await this.#producer.disconnect()
    await this.#consumer.connect()
  }

  onReconnect(callback: () => void) {
    this.#consumer.on('consumer.crash', () => {
      callback()
    })
  }
}
