import { Driver } from '../types/driver.js'
import { ChannelMessageSubscribeHandler, Serializable } from '../types/main.js'
import { Encoder } from '../types/encoder.js'
import { ChannelMessage } from '../types/channel.js'
import { Subscription } from '../subscription.js'

export class HellDriver implements Driver {
  readonly #innerDriver: Driver

  #failProbability: number = 0
  #randomFail: boolean = false

  constructor(innerDriver: Driver) {
    this.#innerDriver = innerDriver
  }

  async init() {}

  publish<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    message: ChannelMessage<T>
  ) {
    this.throwIfFail()
    return this.#innerDriver.publish(channel, encoder, message)
  }

  subscribe<T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    handler: ChannelMessageSubscribeHandler<T>,
    subscription: Subscription
  ) {
    return this.#innerDriver.subscribe(channel, encoder, handler, subscription)
  }

  unsubscribe(channel: string | Subscription) {
    return this.#innerDriver.unsubscribe(channel)
  }

  disconnect() {
    return this.#innerDriver.disconnect()
  }

  onReconnect(_callback: () => void) {
    return this.#innerDriver.onReconnect(_callback)
  }

  failProbability() {
    return this.#failProbability
  }

  alwaysFail() {
    this.#randomFail = false
    this.#failProbability = 1
  }

  alwaysSuccess() {
    this.#randomFail = false
    this.#failProbability = 0
  }

  randomFail() {
    this.#randomFail = true
  }

  private throwIfFail() {
    if (this.#randomFail) {
      this.#failProbability = Math.random()
    }

    if (Math.random() < this.#failProbability) {
      throw new Error('HellDriver: Random failure')
    }
  }
}
