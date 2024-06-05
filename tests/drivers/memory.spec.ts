import { test } from '@japa/runner'
import { MemoryDriver } from '../../src/drivers/memory.js'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'
import { Subscription } from '../../src/channel.js'

test.group('Driver - Memory', () => {
  test('should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(1)
    const driver = new MemoryDriver()
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

  test('all subscribers should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(2)
    const driver = new MemoryDriver()
    const encoder = new JsonEncoder()

    cleanup(() => {
      driver.disconnect()
    })

    await driver.subscribe(
      'test-channel',
      encoder,
      (message) => {
        assert.deepEqual(message, { payload: 'test' })
      },
      new Subscription()
    )

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

  test('should not receive the message emitted if unsubscribed', async ({ assert, cleanup }) => {
    assert.plan(0)

    const driver = new MemoryDriver()
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

    await driver.unsubscribe('test-channel')
    await driver.publish('test-channel', encoder, { payload: 'test' })
  })
})
