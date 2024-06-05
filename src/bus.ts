import { Driver } from './types/driver.js'
import { ChannelMessageSubscribeHandler } from './types/main.js'
import { Encoder } from './types/encoder.js'
import { ChannelMessage } from './types/channel.js'
import { Subscription } from './channel.js'

export class Bus {
  readonly #driver: Driver

  constructor(driver: Driver) {
    this.#driver = driver
  }

  publish(channel: string, encoder: Encoder<any>, message: ChannelMessage<any>) {
    return this.#driver.publish(channel, encoder, message)
  }

  subscribe(
    channel: string,
    encoder: Encoder<any>,
    handler: ChannelMessageSubscribeHandler<any>,
    subscription: Subscription
  ) {
    return this.#driver.subscribe(channel, encoder, handler, subscription)
  }

  unsubscribe(channel: string) {
    return this.#driver.unsubscribe(channel)
  }

  disconnect() {
    return this.#driver.disconnect()
  }

  onReconnect(callback: () => void) {
    return this.#driver.onReconnect(callback)
  }
}
