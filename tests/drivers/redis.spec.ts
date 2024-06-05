import { test } from '@japa/runner'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'
import { RedisDriver } from '../../src/drivers/redis.js'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'
import { setTimeout } from 'node:timers/promises'

test.group('Driver - Redis', (group) => {
  let container: StartedRedisContainer

  group.setup(async () => {
    container = await new RedisContainer().start()

    return async () => {
      await container.stop()
    }
  })

  test('should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(1)

    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    await driver.subscribe(
      'test-channel',
      (message) => {
        assert.deepEqual(message, { payload: 'test' })
        done()
      },
      encoder
    )

    await setTimeout(200)

    await driver.publish('test-channel', { payload: 'test' }, encoder)
  }).waitForDone()

  test('all subscribers should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(2)

    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    await driver.subscribe(
      'test-channel',
      (message) => {
        assert.deepEqual(message, { payload: 'test' })
      },
      encoder
    )

    await driver.subscribe(
      'test-channel',
      (message) => {
        assert.deepEqual(message, { payload: 'test' })
        done()
      },
      encoder
    )

    await setTimeout(200)

    await driver.publish('test-channel', { payload: 'test' }, encoder)
  }).waitForDone()

  test('should not receive the message emitted if unsubscribed', async ({ assert, cleanup }) => {
    assert.plan(0)

    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    await driver.subscribe(
      'test-channel',
      (_message) => {
        assert.fail('should not receive the message')
      },
      encoder
    )

    await setTimeout(200)
    await driver.unsubscribe('test-channel')
    await setTimeout(200)
    await driver.publish('test-channel', { payload: 'test' }, encoder)
  })

  test('should trigger onReconnect when the client reconnects', async ({ assert, cleanup }) => {
    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })

    cleanup(() => driver.disconnect())

    let onReconnectCalled = false
    driver.onReconnect(() => {
      onReconnectCalled = true
    })

    await container.restart()
    await setTimeout(200)

    assert.isTrue(onReconnectCalled)
  })
})
