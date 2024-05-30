import { ChannelEncoder, ChannelMessage, Serializable } from '../types/main.js'

export class JsonEncoder<T extends Serializable> implements ChannelEncoder<T> {
  encode(message: ChannelMessage<T>): string {
    return JSON.stringify(message)
  }

  decode(data: string) {
    return JSON.parse(data)
  }
}
