import { Encoder } from '../types/encoder.js'
import { Serializable } from '../types/main.js'
import { ChannelMessage } from '../types/channel.js'
import vine, { VineObject } from '@vinejs/vine'

export function vineJsonEncoder<T extends Serializable>(config: VineJsonEncoderConfig<T>) {
  return new VineJsonEncoder<T>(config)
}

interface VineJsonEncoderConfig<T> {
  schema: VineObject<any, T, T, T>
}

export class VineJsonEncoder<T extends Serializable> implements Encoder<T> {
  readonly #schema: VineObject<any, T, T, T>

  constructor(config: VineJsonEncoderConfig<T>) {
    this.#schema = config.schema
  }

  encode(message: ChannelMessage<T>): string {
    return JSON.stringify(message)
  }

  async decode(message: string): Promise<ChannelMessage<T> | null> {
    try {
      const parsedMessage = JSON.parse(message)
      const result = await vine.validate({ schema: this.#schema, data: parsedMessage.payload })

      return {
        payload: result,
      }
    } catch (error) {
      return null
    }
  }
}
