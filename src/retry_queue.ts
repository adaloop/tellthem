import { ChannelMessage } from './types/channel.js'
import { RetryQueueOptions } from './types/retry_queue.js'
import { Encoder } from './types/encoder.js'

export class RetryQueue {
  readonly #options: RetryQueueOptions

  #queue = new Set<{ channel: string; encoder: Encoder<any>; message: ChannelMessage<any> }>()

  constructor(options: RetryQueueOptions = {}) {
    const { enabled = true, maxSize = null } = options

    this.#options = {
      enabled,
      maxSize,
    }
  }

  async process(
    handler: (
      channel: string,
      encoder: Encoder<any>,
      message: ChannelMessage<any>
    ) => Promise<boolean>
  ) {
    if (!this.#options.enabled) return

    for (const dequeued of this.#queue) {
      const result = await handler(dequeued.channel, dequeued.encoder, dequeued.message).catch(
        () => false
      )

      if (!result) return

      this.#queue.delete(dequeued)
    }
  }

  enqueue(channel: string, encoder: Encoder<any>, message: ChannelMessage<any>): boolean {
    if (!this.#options.enabled) return false

    if (this.#options.maxSize && this.#queue.size >= this.#options.maxSize) {
      return false
    }

    this.#queue.add({ channel, encoder, message })

    return true
  }
}
