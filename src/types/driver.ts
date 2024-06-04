import { Serializable, SubscribeHandler } from './main.js'

export interface Driver {
  publish: <T extends Serializable>(channel: string, message: T) => Promise<void>
  subscribe: <T extends Serializable>(
    channel: string,
    handler: SubscribeHandler<T>
  ) => Promise<void>
  unsubscribe: (channel: string) => Promise<void>
  disconnect: () => Promise<void>
  onReconnect: (callback: () => void) => void
}

export type DriverFactory = () => Driver
