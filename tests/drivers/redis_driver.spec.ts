import { test } from '@japa/runner'
import { setTimeout } from 'node:timers/promises'
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis'
import { TyBus } from '../../src/ty_bus.js'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'
import { redis } from '../../src/drivers/redis.js'

test.group('Drivers - Redis', (group) => {
  let container: StartedRedisContainer

  group.setup(async () => {
    container = await new RedisContainer().start()

    return async () => {
      await container.stop()
    }
  })

  test('should receive message emitted', async ({ assert, cleanup }, done) => {
    const tyBus = new TyBus({
      default: 'redis',
      services: {
        redis: {
          driver: redis(container.getConnectionUrl()),
        },
      },
    })

    cleanup(() => {
      tyBus.getBus('redis').disconnect()
    })

    const queue = tyBus.channel({
      name: 'test-queue',
      encoder: new JsonEncoder(),
    })

    await queue.subscribe((payload) => {
      console.log('received: ' + payload)
      assert.equal(payload, 'test')
      done()
    })

    await setTimeout(200)

    await queue.publish('test')
  }).waitForDone()
})
