import { ChannelMessage } from './channel.js'
import { Exception } from '@poppinss/utils'

export type OnFailHandler = (exception: Exception) => void

export type SubscribeHandler<T extends Serializable> = (payload: T) => void | Promise<void>

export type ChannelMessageSubscribeHandler<T extends Serializable> = (
  payload: ChannelMessage<T>
) => void | Promise<void>

export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable }

export type Duration = number | string
