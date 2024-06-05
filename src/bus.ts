import { Driver } from './types/driver.js'
import { ChannelMessageSubscribeHandler } from './types/main.js'
import { Encoder } from './types/encoder.js'
import { ChannelMessage } from './types/channel.js'

export class Bus {
  readonly #driver: Driver

  constructor(driver: Driver) {
    this.#driver = driver
  }

  publish(channel: string, message: ChannelMessage<any>, encoder: Encoder<any>) {
    return this.#driver.publish(channel, message, encoder)
  }

  subscribe(channel: string, handler: ChannelMessageSubscribeHandler<any>, encoder: Encoder<any>) {
    return this.#driver.subscribe(channel, handler, encoder)
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
