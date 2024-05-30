export interface TyBusConfig<KnownDrivers extends Record<string, Driver>> {
  default?: keyof KnownDrivers
  drivers: KnownDrivers
}

export interface Driver {}
