import { test } from '@japa/runner'
import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { AmqpDriver } from '../../src/drivers/amqp.js'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'
import { setTimeout } from 'node:timers/promises'
import { ZodJsonEncoder } from '../../src/encoders/zod_json_encoder.js'
import { z } from 'zod'
import { E_FAILED_DECODE_MESSAGE } from '../../src/errors.js'
import { Subscription } from '../../src/subscription.js'

test.group('Drivers - Amqp', (group) => {
  let container: StartedTestContainer

  group.setup(async () => {
    container = await new GenericContainer('rabbitmq:3.7.25-management-alpine')
      .withExposedPorts(5672)
      .start()

    return async () => {
      await container.stop()
    }
  })

  test('should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(1)

    const driver = new AmqpDriver({
      hostname: container.getHost(),
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

  test('only one subscriber should receive the message emitted', async ({ assert, cleanup }) => {
    assert.plan(1)

    const driver = new AmqpDriver({
      hostname: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    let received = 0

    await driver.subscribe(
      'test-channel-once',
      encoder,
      (_message) => {
        received++
      },
      new Subscription()
    )

    await driver.subscribe(
      'test-channel-once',
      encoder,
      (_message) => {
        received++
      },
      new Subscription()
    )

    await setTimeout(200)
    await driver.publish('test-channel-once', encoder, { payload: 'test' })
    await setTimeout(1000)

    assert.equal(received, 1)
  }).disableTimeout()

  test('should not receive the message emitted if all unsubscribed', async ({
    assert,
    cleanup,
  }) => {
    assert.plan(0)

    const driver = new AmqpDriver({
      hostname: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    await driver.subscribe(
      'test-channel-unsub',
      encoder,
      () => {
        assert.fail('should not receive the message')
      },
      new Subscription()
    )

    await driver.subscribe(
      'test-channel-unsub',
      encoder,
      () => {
        assert.fail('should not receive the message')
      },
      new Subscription()
    )

    await setTimeout(200)
    await driver.unsubscribe('test-channel-unsub')
    await setTimeout(200)
    await driver.publish('test-channel-unsub', encoder, { payload: 'test' })
    await setTimeout(1000)
  }).disableTimeout()

  test('should only unsubscribe one subscriber', async ({ assert, cleanup }) => {
    const driver = new AmqpDriver({
      hostname: container.getHost(),
      port: container.getFirstMappedPort(),
    })
    await driver.init()
    const encoder = new JsonEncoder()

    cleanup(() => driver.disconnect())

    const subscription1 = new Subscription()
    subscription1.setChannel('test-channel-unsub1')
    subscription1.setDriver(driver)

    const subscription2 = new Subscription()
    subscription2.setChannel('test-channel-unsub1')
    subscription2.setDriver(driver)

    let received = 0

    await driver.subscribe(
      'test-channel-unsub1',
      encoder,
      () => {
        received++
        assert.fail('should not receive the message')
      },
      subscription1
    )

    await driver.subscribe(
      'test-channel-unsub1',
      encoder,
      () => {
        received++
      },
      subscription2
    )

    await setTimeout(200)
    await subscription1.unsubscribe()
    await setTimeout(200)
    await driver.publish('test-channel-unsub1', encoder, { payload: 'test' })
    await setTimeout(1000)
    assert.equal(received, 1)
  }).disableTimeout()

  test('should trigger onFail when message is not decoded correctly', async ({
    assert,
    cleanup,
  }) => {
    assert.plan(1)

    const driver = new AmqpDriver({
      hostname: container.getHost(),
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
    await driver.subscribe('test-channel-fail', encoder, (_message) => {}, subscription)

    subscription.onFail((exception) => {
      assert.instanceOf(exception, E_FAILED_DECODE_MESSAGE)
    })

    await setTimeout(200)
    await driver.publish('test-channel-fail', encoder, { payload: { test: false } as any })
    await setTimeout(1000)
  }).disableTimeout()
})
