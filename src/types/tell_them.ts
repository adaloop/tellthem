import { BusConfig } from './bus.js'

export interface TellThemConfig<KnownBuses extends Record<string, BusConfig>> {
  default?: keyof KnownBuses
  buses: KnownBuses
}
