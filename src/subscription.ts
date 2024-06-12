import { OnFailHandler } from './types/main.js'
import { createId } from '@paralleldrive/cuid2'
import { Driver } from './types/driver.js'

export class Subscription {
  id: string
  channel?: string
  onFailHandler?: OnFailHandler

  #driver?: Driver

  constructor() {
    this.id = createId()
  }

  setId(id: string) {
    this.id = id
  }

  setChannel(channel: string) {
    this.channel = channel
  }

  setDriver(driver: Driver) {
    this.#driver = driver
  }

  onFail(handler: OnFailHandler) {
    this.onFailHandler = handler
  }

  async unsubscribe() {
    if (this.#driver) await this.#driver.unsubscribe(this)
  }
}
