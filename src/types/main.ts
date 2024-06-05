import { ChannelMessage } from './channel.js'

export type SubscribeHandler<T extends Serializable> = (
  payload: ChannelMessage<T>
) => void | Promise<void>

export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable }
