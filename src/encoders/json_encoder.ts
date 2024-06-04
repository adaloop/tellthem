import { Encoder } from '../types/encoder.js'
import { Serializable } from '../types/main.js'
import { ChannelMessage } from '../types/channel.js'

export class JsonEncoder<T extends Serializable> implements Encoder<T> {
  encode(message: ChannelMessage<T>): string {
    return JSON.stringify(message)
  }

  decode(message: string): ChannelMessage<T> | null {
    try {
      return JSON.parse(message)
    } catch (err) {
      return null
    }
  }
}
