import { ChannelMessageSubscribeHandler, Serializable } from './main.js'
import { Encoder } from './encoder.js'
import { ChannelMessage } from './channel.js'
import { Subscription } from '../subscription.js'

export interface Driver {
  init: () => Promise<void>
  publish: <T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    message: ChannelMessage<T>
  ) => Promise<void>
  subscribe: <T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    handler: ChannelMessageSubscribeHandler<T>,
    subscription: Subscription
  ) => Promise<void>
  unsubscribe: (target: string | Subscription) => Promise<void>
  disconnect: () => Promise<void>
  onReconnect: (callback: () => void) => void
}

export type DriverFactory = () => Driver
