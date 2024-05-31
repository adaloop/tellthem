import { Channel } from '../channel.js'

export interface TyBusConfig<KnownServices extends Record<string, ServiceConfig>> {
  default?: keyof KnownServices
  services: KnownServices
}

export interface ServiceConfig {
  driver: DriverFactory
}

export type DriverFactory = () => Driver

export interface Driver {
  publish: <KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>,
    payload: Payload
  ) => Promise<void>
  subscribe: <KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>,
    handler: SubscribeHandler<Payload>
  ) => Promise<void>
  unsubscribe: <KnownServices extends Record<string, ServiceConfig>, Payload>(
    channel: Channel<KnownServices, Payload>
  ) => Promise<void>
  disconnect: () => Promise<void>
  onReconnect: (callback: () => void) => void
}

export interface ChannelConfig<KnownServices extends Record<string, ServiceConfig>, Payload> {
  name: string
  defaultService?: keyof KnownServices
  encoder: ChannelEncoder<Payload>
}

export interface ChannelMessage<T> {
  payload: T
}

export interface ChannelEncoder<T> {
  encode: (message: ChannelMessage<T>) => string
  decode: (data: string) => ChannelMessage<T> | null
}

export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable }

export type SubscribeHandler<T> = (payload: T) => void
