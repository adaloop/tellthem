import { Encoder } from '../types/encoder.js'
import { Serializable } from '../types/main.js'
import { ChannelMessage } from '../types/channel.js'
import yup from 'yup'

export function yupJsonEncoder<T extends Serializable>(config: YupJsonEncoderConfig<T>) {
  return new YupJsonEncoder<T>(config)
}

interface YupJsonEncoderConfig<T> {
  schema: yup.Schema<T>
}

export class YupJsonEncoder<T extends Serializable> implements Encoder<T> {
  readonly #schema: yup.Schema

  constructor(config: YupJsonEncoderConfig<T>) {
    this.#schema = config.schema
  }

  encode(message: ChannelMessage<T>): string {
    return JSON.stringify(message)
  }

  async decode(message: string): Promise<ChannelMessage<T> | null> {
    try {
      const parsedMessage = JSON.parse(message)
      const result = await this.#schema.validate(parsedMessage.payload)

      return {
        payload: result,
      }
    } catch {
      return null
    }
  }
}
