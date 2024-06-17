import { Driver } from './types/driver.js'
import { ChannelMessageSubscribeHandler } from './types/main.js'
import { Encoder } from './types/encoder.js'
import { ChannelMessage } from './types/channel.js'
import { BusOptions } from './types/bus.js'
import { RetryQueue } from './retry_queue.js'
import { clearInterval } from 'node:timers'
import { parse } from '@lukeed/ms'
import { Subscription } from './subscription.js'

export class Bus {
  readonly driver: Driver

  readonly #options: BusOptions

  readonly errorRetryQueue: RetryQueue
  readonly retryQueueInterval: NodeJS.Timeout | undefined

  constructor(driver: Driver, options: BusOptions) {
    this.driver = driver
    this.#options = options
    this.errorRetryQueue = new RetryQueue(options?.retryQueue)

    if (options.retryQueue?.enabled) {
      options.retryQueue.retryInterval = options.retryQueue.retryInterval || 1000

      const intervalValue =
        typeof options?.retryQueue.retryInterval === 'number'
          ? options?.retryQueue.retryInterval
          : parse(options?.retryQueue.retryInterval)

      this.retryQueueInterval = setInterval(() => {
        void this.processErrorRetryQueue()
      }, intervalValue)
    }
  }

  processErrorRetryQueue() {
    return this.errorRetryQueue.process(async (channel, encoder, message) => {
      return await this.publish(channel, encoder, message)
    })
  }

  async publish(channel: string, encoder: Encoder<any>, message: ChannelMessage<any>) {
    try {
      await this.driver.publish(channel, encoder, message)

      return true
    } catch (error) {
      if (this.#options.retryQueue?.enabled) {
        this.errorRetryQueue.enqueue(channel, encoder, message)
      }

      return false
    }
  }

  subscribe(
    channel: string,
    encoder: Encoder<any>,
    handler: ChannelMessageSubscribeHandler<any>,
    subscription: Subscription
  ) {
    return this.driver.subscribe(channel, encoder, handler, subscription)
  }

  unsubscribe(target: string | Subscription) {
    return this.driver.unsubscribe(target)
  }

  disconnect() {
    if (this.retryQueueInterval) {
      clearInterval(this.retryQueueInterval)
    }

    return this.driver.disconnect()
  }

  onReconnect(callback: () => void) {
    return this.driver.onReconnect(callback)
  }
}
