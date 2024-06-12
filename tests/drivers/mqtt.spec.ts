import { test } from '@japa/runner'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'
import { setTimeout } from 'node:timers/promises'
import { ZodJsonEncoder } from '../../src/encoders/zod_json_encoder.js'
import { z } from 'zod'
import { E_FAILED_DECODE_MESSAGE } from '../../src/errors.js'
import { HiveMQContainer, StartedHiveMQContainer } from '@testcontainers/hivemq'
import { MqttDriver } from '../../src/drivers/mqtt.js'
import { Subscription } from '../../src/subscription.js'

test.group('Drivers - Mqtt', (group) => {
  let container: StartedHiveMQContainer

  group.setup(async () => {
    container = await new HiveMQContainer().start()

    return async () => {
      await container.stop()
    }
  })

  test('should receive the message emitted', async ({ assert, cleanup }, done) => {
    assert.plan(1)

    const driver = new MqttDriver({
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

    const driver = new MqttDriver({
      host: container.getHost(),
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

    assert.equal(received, 2)
  }).disableTimeout()

  test('should not receive the message emitted if unsubscribed', async ({ assert, cleanup }) => {
    assert.plan(0)

    const driver = new MqttDriver({
      host: container.getHost(),
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

    await setTimeout(200)
    await driver.unsubscribe('test-channel-unsub')
    await setTimeout(200)
    await driver.publish('test-channel-unsub', encoder, { payload: 'test' })
    await setTimeout(1000)
  }).disableTimeout()

  test('should trigger onFail when message is not decoded correctly', async ({
    assert,
    cleanup,
  }) => {
    assert.plan(1)

    const driver = new MqttDriver({
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
    await driver.subscribe('test-channel-fail', encoder, (_message) => {}, subscription)

    subscription.onFail((exception) => {
      assert.instanceOf(exception, E_FAILED_DECODE_MESSAGE)
    })

    await setTimeout(200)
    await driver.publish('test-channel-fail', encoder, { payload: { test: false } as any })
    await setTimeout(1000)
  }).disableTimeout()
})
