import { Serializable, SubscribeHandler } from './main.js'
import { Encoder } from './encoder.js'
import { ChannelMessage } from './channel.js'

export interface Driver {
  publish: <T extends Serializable>(
    channel: string,
    message: ChannelMessage<T>,
    encoder: Encoder<T>
  ) => Promise<void>
  subscribe: <T extends Serializable>(
    channel: string,
    handler: SubscribeHandler<T>,
    encoder: Encoder<T>
  ) => Promise<void>
  unsubscribe: (channel: string) => Promise<void>
  disconnect: () => Promise<void>
  onReconnect: (callback: () => void) => void
}

export type DriverFactory = () => Driver
