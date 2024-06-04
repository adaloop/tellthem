export type SubscribeHandler<T extends Serializable> = (payload: T) => void | Promise<void>

export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable }
