import { DriverFactory } from './driver.js'
import { RetryQueueOptions } from './retry_queue.js'

export interface BusConfig extends BusOptions {
  driver: DriverFactory
}

export interface BusOptions {
  retryQueue?: RetryQueueOptions
}
