import { test } from '@japa/runner'
import { MemoryDriver } from '../../src/drivers/memory.js'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'
import { Subscription } from '../../src/subscription.js'

test.group('Drivers - Memory', () => {
  test('should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(1)
    const driver = new MemoryDriver()
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => {
      driver.disconnect()
    })

    await driver.subscribe(
      'test-channel',
      encoder,
      (message) => {
        assert.deepEqual(message, { payload: 'test' })
        done()
      },
      new Subscription()
    )

    await driver.publish('test-channel', encoder, { payload: 'test' })
  }).waitForDone()

  test('all subscribers should receive the message emitted', async ({ assert, cleanup }) => {
    assert.plan(1)
    const driver = new MemoryDriver()
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => {
      driver.disconnect()
    })

    let received = 0

    await driver.subscribe(
      'test-channel',
      encoder,
      (_message) => {
        received++
      },
      new Subscription()
    )

    await driver.subscribe(
      'test-channel',
      encoder,
      (_message) => {
        received++
      },
      new Subscription()
    )

    await driver.publish('test-channel', encoder, { payload: 'test' })

    assert.equal(received, 2)
  })

  test('should not receive the message emitted if all unsubscribed', async ({
    assert,
    cleanup,
  }) => {
    assert.plan(0)

    const driver = new MemoryDriver()
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => {
      driver.disconnect()
    })

    await driver.subscribe(
      'test-channel',
      encoder,
      (_message) => {
        assert.fail('should not receive the message')
      },
      new Subscription()
    )

    await driver.subscribe(
      'test-channel',
      encoder,
      (_message) => {
        assert.fail('should not receive the message')
      },
      new Subscription()
    )

    await driver.unsubscribe('test-channel')
    await driver.publish('test-channel', encoder, { payload: 'test' })
  })

  test('should only unsubscribe one subscriber', async ({ assert, cleanup }) => {
    const driver = new MemoryDriver()
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => {
      driver.disconnect()
    })

    const subscription1 = new Subscription()
    subscription1.setChannel('test-channel')
    subscription1.setDriver(driver)

    const subscription2 = new Subscription()
    subscription2.setChannel('test-channel')
    subscription2.setDriver(driver)

    let received = 0

    await driver.subscribe(
      'test-channel',
      encoder,
      (_message) => {
        received++
        assert.fail('should not receive the message')
      },
      subscription1
    )

    await driver.subscribe(
      'test-channel',
      encoder,
      (_message) => {
        received++
      },
      subscription2
    )

    await subscription1.unsubscribe()
    await driver.publish('test-channel', encoder, { payload: 'test' })

    assert.equal(received, 1)
  })
})
