import { Encoder } from '../types/encoder.js'
import { z } from 'zod'
import { Serializable } from '../types/main.js'
import { ChannelMessage } from '../types/channel.js'

export function zodJsonEncoder<T extends Serializable>(config: ZodJsonEncoderConfig<T>) {
  return new ZodJsonEncoder<T>(config)
}

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

  decode(message: string): Promise<ChannelMessage<T> | null> {
    return new Promise((resolve) => {
      try {
        const parsedMessage = JSON.parse(message)
        const result = this.#schema.safeParse(parsedMessage.payload)

        if (!result.success) {
          resolve(null)
        }

        resolve({
          payload: result.data,
        })
      } catch {
        resolve(null)
      }
    })
  }
}
