import { Encoder } from '../types/encoder.js'
import { z } from 'zod'
import { Serializable } from '../types/main.js'
import { ChannelMessage } from '../types/channel.js'

interface ZodJsonEncoderConfig<T> {
  schema: z.ZodSchema<T>
}

export class ZodJsonEncoder<T extends Serializable> implements Encoder<T> {
  readonly #schema: z.Schema

  constructor(config: ZodJsonEncoderConfig<T>) {
    this.#schema = config.schema
  }

  encode(message: ChannelMessage<T>): string {
    return JSON.stringify(message)
  }

  decode(message: string): ChannelMessage<T> | null {
    const parsedMessage = JSON.parse(message)
    const result = this.#schema.safeParse(parsedMessage.payload)

    if (!result.success) {
      return null
    }

    return {
      payload: result.data,
    }
  }
}