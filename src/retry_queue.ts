import { ChannelMessage } from './types/channel.js'
import { RetryQueueOptions } from './types/retry_queue.js'
import { Encoder } from './types/encoder.js'
import { Queue } from './queue.js'

export class RetryQueue {
  readonly #options: RetryQueueOptions

  #queue = new Queue<{ channel: string; encoder: Encoder<any>; message: ChannelMessage<any> }>()

  constructor(options: RetryQueueOptions = {}) {
    const { enabled = false, maxSize = null } = options

    this.#options = {
      enabled,
      maxSize,
    }
  }

  size() {
    return this.#queue.size()
  }

  async process(
    handler: (
      channel: string,
      encoder: Encoder<any>,
      message: ChannelMessage<any>
    ) => Promise<boolean>
  ) {
    if (!this.#options.enabled) return

    const toProcess = this.#queue.size()

    for (let i = 0; i < toProcess; i++) {
      const dequeued = this.#queue.dequeue()

      if (!dequeued) break

      await handler(dequeued.channel, dequeued.encoder, dequeued.message).catch(() => false)
    }
  }

  enqueue(channel: string, encoder: Encoder<any>, message: ChannelMessage<any>): boolean {
    if (!this.#options.enabled) return false

    if (this.#options.maxSize && this.#queue.size() >= this.#options.maxSize) {
      return false
    }

    this.#queue.enqueue({ channel, encoder, message })

    return true
  }
}
