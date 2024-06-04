import { test } from '@japa/runner'
import { MemoryDriver } from '../../src/drivers/memory.js'

test.group('Driver - Memory', () => {
  test('should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(1)
    const driver = new MemoryDriver()

    cleanup(() => {
      driver.disconnect()
    })

    await driver.subscribe('test-channel', (message) => {
      assert.equal(message, 'test')
      done()
    })

    await driver.publish('test-channel', 'test')
  }).waitForDone()

  test('all subscribers should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(2)
    const driver = new MemoryDriver()

    cleanup(() => {
      driver.disconnect()
    })

    await driver.subscribe('test-channel', (message) => {
      assert.equal(message, 'test')
    })

    await driver.subscribe('test-channel', (message) => {
      assert.equal(message, 'test')
      done()
    })

    await driver.publish('test-channel', 'test')
  }).waitForDone()

  test('should not receive the message emitted if unsubscribed', async ({ assert, cleanup }) => {
    assert.plan(0)

    const driver = new MemoryDriver()

    cleanup(() => {
      driver.disconnect()
    })

    await driver.subscribe('test-channel', (message) => {
      assert.equal(message, 'test')
    })

    await driver.unsubscribe('test-channel')
    await driver.publish('test-channel', 'test')
  })
})
