import { Serializable } from './main.js'

export interface ChannelMessage<T extends Serializable> {
  payload: T
}
