import { Duration } from './main.js'

export interface RetryQueueOptions {
  enabled?: boolean
  maxSize?: number | null
  retryInterval?: Duration | null
}
