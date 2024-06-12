import { Encoder } from '../types/encoder.js'
import { Serializable } from '../types/main.js'
import { ChannelMessage } from '../types/channel.js'

export function jsonEncoder<T extends Serializable>() {
  return new JsonEncoder<T>()
}

export class JsonEncoder<T extends Serializable> implements Encoder<T> {
  encode(message: ChannelMessage<T>): string {
    return JSON.stringify(message)
  }

  decode(message: string): Promise<ChannelMessage<T> | null> {
    return new Promise((resolve) => {
      try {
        resolve(JSON.parse(message))
      } catch (err) {
        resolve(null)
      }
    })
  }
}
