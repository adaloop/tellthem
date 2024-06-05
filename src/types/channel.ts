import { Serializable } from './main.js'
import { BusConfig } from './bus.js'
import { Encoder } from './encoder.js'

export interface ChannelMessage<T extends Serializable> {
  payload: T
}

export interface ChannelConfig<
  KnownBuses extends Record<string, BusConfig>,
  Payload extends Serializable,
> {
  name: string
  defaultBus?: keyof KnownBuses
  encoder: Encoder<Payload>
}
