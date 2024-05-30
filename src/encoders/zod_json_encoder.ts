import { ChannelEncoder, ChannelMessage } from '../types/main.js'
import { z } from 'zod'

interface ZodJsonEncoderConfig<T> {
  schema: z.ZodSchema<T>
}

export class ZodJsonEncoder<T> implements ChannelEncoder<T> {
  readonly #schema: z.Schema

  constructor(config: ZodJsonEncoderConfig<T>) {
    this.#schema = config.schema
  }

  encode(message: ChannelMessage<T>) {
    return JSON.stringify(message)
  }

  decode(data: string) {
    const message = JSON.parse(data)
    const result = this.#schema.safeParse(message.payload)

    if (!result.success) {
      return null
    }

    return {
      payload: result.data,
    }
  }
}
