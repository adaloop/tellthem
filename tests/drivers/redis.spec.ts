import { test } from '@japa/runner'
import { RedisDriver } from '../../src/drivers/redis.js'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'
import { setTimeout } from 'node:timers/promises'
import { Subscription } from '../../src/channel.js'
import { E_FAILED_DECODE_MESSAGE } from '../../src/errors.js'
import { ZodJsonEncoder } from '../../src/encoders/zod_json_encoder.js'
import { z } from 'zod'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'

test.group('Drivers - Redis', (group) => {
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
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    await driver.subscribe(
      'test-channel',
      encoder,
      (message) => {
        assert.deepEqual(message, { payload: 'test' })
        done()
      },
      new Subscription()
    )

    await setTimeout(200)

    await driver.publish('test-channel', encoder, { payload: 'test' })
  }).waitForDone()

  test('all subscribers should receive the message emitted', async ({ assert, cleanup }) => {
    assert.plan(1)

    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

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

    await setTimeout(200)
    await driver.publish('test-channel', encoder, { payload: 'test' })
    await setTimeout(1000)
    assert.equal(received, 2)
  })

  test('should not receive the message emitted if unsubscribed', async ({ assert, cleanup }) => {
    assert.plan(0)

    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    await driver.subscribe(
      'test-channel',
      encoder,
      (_message) => {
        assert.fail('should not receive the message')
      },
      new Subscription()
    )

    await setTimeout(200)
    await driver.unsubscribe('test-channel')
    await setTimeout(200)
    await driver.publish('test-channel', encoder, { payload: 'test' })
    await setTimeout(1000)
  }).disableTimeout()

  test('should trigger onFail when message is not decoded correctly', async ({
    assert,
    cleanup,
  }) => {
    assert.plan(1)

    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    await driver.init()
    const encoder = new ZodJsonEncoder({
      schema: z.object({
        test: z.string(),
      }),
    })

    cleanup(() => driver.disconnect())

    const subscription = new Subscription()

    await driver.subscribe('test-channel', encoder, (_message) => {}, subscription)

    subscription.onFail((exception) => {
      assert.instanceOf(exception, E_FAILED_DECODE_MESSAGE)
    })

    await setTimeout(200)
    await driver.publish('test-channel', encoder, { payload: { test: false } as any })
    await setTimeout(1000)
  }).disableTimeout()

  test('should trigger onReconnect when the client reconnects', async ({ assert, cleanup }) => {
    const driver = new RedisDriver({
      host: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    await driver.init()

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
