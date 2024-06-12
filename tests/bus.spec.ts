import { test } from '@japa/runner'
import { Bus } from '../src/bus.js'
import { MemoryDriver } from '../src/drivers/memory.js'
import { HellDriver } from '../src/test_helpers/hell_driver.js'
import { jsonEncoder } from '../src/encoders/json_encoder.js'
import { Subscription } from '../src/subscription.js'

test.group('Bus', () => {
  test('should process retry queue within the interval', async ({ assert, cleanup }, done) => {
    const driver = new HellDriver(new MemoryDriver())
    const encoder = jsonEncoder()
    const bus = new Bus(driver, {
      retryQueue: {
        enabled: true,
        retryInterval: '500ms',
      },
    })

    cleanup(async () => {
      await bus.disconnect()
    })

    await bus.subscribe(
      'test',
      encoder,
      (message) => {
        assert.deepEqual(message, { payload: 'test' })
        done()
      },
      new Subscription()
    )

    driver.alwaysFail()

    await bus.publish('test', encoder, { payload: 'test' })

    assert.equal(bus.errorRetryQueue.size(), 1)

    driver.alwaysSuccess()
  }).waitForDone()

  test('should not create interval if not interval provided', ({ assert, cleanup }) => {
    const driver = new HellDriver(new MemoryDriver())
    const bus = new Bus(driver, {
      retryQueue: {
        enabled: true,
      },
    })

    cleanup(async () => {
      await bus.disconnect()
    })

    assert.isUndefined(bus.retryQueueInterval)
  })

  test('should not add to retry queue if disabled', async ({ assert, cleanup }) => {
    const driver = new HellDriver(new MemoryDriver())
    const bus = new Bus(driver, {
      retryQueue: {
        enabled: false,
      },
    })

    cleanup(async () => {
      await bus.disconnect()
    })

    driver.alwaysFail()

    const wasPublished = await bus.publish('test', jsonEncoder(), { payload: 'test' })

    assert.equal(bus.errorRetryQueue.size(), 0)
    assert.isFalse(wasPublished)
  })

  test('should not remove item from retry queue if publish failed', async ({ assert, cleanup }) => {
    const driver = new HellDriver(new MemoryDriver())
    const bus = new Bus(driver, {
      retryQueue: {
        enabled: true,
      },
    })

    cleanup(async () => {
      await bus.disconnect()
    })

    driver.alwaysFail()

    assert.equal(bus.errorRetryQueue.size(), 0)
    await bus.publish('test', jsonEncoder(), { payload: 'test' })
    assert.equal(bus.errorRetryQueue.size(), 1)
    await bus.processErrorRetryQueue()
    assert.equal(bus.errorRetryQueue.size(), 1)
  })
})
