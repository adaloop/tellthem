import { Driver, DriverFactory } from '../types/driver.js'
import { ChannelMessageSubscribeHandler, Serializable } from '../types/main.js'
import { Encoder } from '../types/encoder.js'
import { ChannelMessage } from '../types/channel.js'
import { Subscription } from '../channel.js'
import amqplib from 'amqplib'
import { E_DRIVER_NOT_INITIALIZED, E_FAILED_DECODE_MESSAGE } from '../errors.js'
import debug from '../utils/debug.js'

interface AmqpDriverConfig extends amqplib.Options.Connect {}

export function amqp(config: AmqpDriverConfig): DriverFactory {
  return () => new AmqpDriver(config)
}

export class AmqpDriver implements Driver {
  #config: amqplib.Options.Connect

  #publisher?: amqplib.Connection
  #subscriber?: amqplib.Connection

  #publisherChannel?: amqplib.Channel
  #subscriberChannel?: amqplib.Channel

  #consumers: Map<string, Array<amqplib.Replies.Consume>> = new Map()

  constructor(config: AmqpDriverConfig) {
    this.#config = config
  }

  async init() {
    this.#publisher = await amqplib.connect(this.#config)
    this.#subscriber = await amqplib.connect(this.#config)
  }

  async publish<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    message: ChannelMessage<T>
  ) {
    const encoded = encoder.encode(message)

    const amqpChannel = await this.getPublisherChannel()
    await amqpChannel.assertQueue(channel, { durable: true })

    amqpChannel.sendToQueue(channel, Buffer.from(encoded))

    await amqpChannel.close()
  }

  async subscribe<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    handler: ChannelMessageSubscribeHandler<T>,
    subscription: Subscription
  ) {
    const amqpChannel = await this.getSubscriberChannel()
    await amqpChannel.assertQueue(channel, { durable: true })

    const consumer = await amqpChannel.consume(channel, async (message) => {
      if (!message) return

      amqpChannel.ack(message)

      debug('received message for channel "%s"', channel)

      const decoded = encoder.decode(message.content.toString())

      if (!decoded) {
        if (subscription.onFailHandler) {
          subscription.onFailHandler(new E_FAILED_DECODE_MESSAGE())
        }

        return
      }

      handler(decoded)
    })

    // Store channel consumers to manage unsubscribe
    const consumers = this.#consumers.get(channel) || []
    consumers.push(consumer)
    this.#consumers.set(channel, consumers)
  }

  async unsubscribe(channel: string) {
    const amqpChannel = await this.getSubscriberChannel()

    const consumers = this.#consumers.get(channel) || []

    for (const { consumerTag } of consumers) {
      await amqpChannel.cancel(consumerTag)
    }
  }

  async disconnect() {
    await this.#publisher?.close()
    await this.#subscriber?.close()
  }

  onReconnect(_callback: () => void) {}

  private async getPublisherChannel(): Promise<amqplib.Channel> {
    if (!this.#publisher) {
      throw new E_DRIVER_NOT_INITIALIZED()
    }

    if (!this.#publisherChannel) {
      this.#publisherChannel = await this.#publisher.createChannel()
    }

    return this.#publisherChannel
  }

  private async getSubscriberChannel(): Promise<amqplib.Channel> {
    if (!this.#subscriber) {
      throw new E_DRIVER_NOT_INITIALIZED()
    }

    if (!this.#subscriberChannel) {
      this.#subscriberChannel = await this.#subscriber.createChannel()
    }

    return this.#subscriberChannel
  }
}
