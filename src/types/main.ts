export interface TyBusConfig<KnownServices extends Record<string, ServiceConfig>> {
  default?: keyof KnownServices
  services: KnownServices
}

export interface ServiceConfig {
  driver: Driver
}

export interface Driver {}

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
