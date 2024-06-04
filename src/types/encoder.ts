import { Serializable } from './main.js'
import { ChannelMessage } from './channel.js'

export interface Encoder<T extends Serializable> {
  encode(message: ChannelMessage<T>): string
  decode(message: string): ChannelMessage<T> | null
}
