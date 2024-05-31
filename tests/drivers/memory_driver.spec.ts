import { test } from '@japa/runner'
import { TyBus } from '../../src/ty_bus.js'
import { memory } from '../../src/drivers/memory.js'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'

test.group('Drivers - Memory', () => {
  const tyBus = new TyBus({
    default: 'memory',
    services: {
      memory: {
        driver: memory(),
      },
    },
  })

  const queue = tyBus.channel({
    name: 'test-queue',
    encoder: new JsonEncoder(),
  })

  test('should receive message emitted', ({ assert }, done) => {
    queue.subscribe((payload) => {
      assert.equal(payload, 'test')
      done()
    })

    queue.publish('test')
  }).waitForDone()
})
