import { test } from '@japa/runner'
import { TellThem } from '../src/tell_them.js'
import { memory } from '../src/drivers/memory.js'
import { JsonEncoder } from '../src/encoders/json_encoder.js'
import { setTimeout } from 'node:timers/promises'

test.group('Channel', () => {
  test('should receive the message emitted', async ({ assert }, done) => {
    assert.plan(1)

    const tellThem = new TellThem({
      buses: {
        memory: {
          driver: memory(),
        },
      },
    })

    const channel = tellThem.channel({
      defaultBus: 'memory',
      name: 'test-channel',
      encoder: new JsonEncoder(),
    })

    await channel.subscribe((message) => {
      assert.equal(message, 'test')
      done()
    })

    await setTimeout(200)

    await channel.publish('test')
  }).waitForDone()

  test('should not received the message emitted if unsubscribed', async ({ assert }) => {
    const tellThem = new TellThem({
      buses: {
        memory: {
          driver: memory(),
        },
      },
    })

    const channel = tellThem.channel({
      defaultBus: 'memory',
      name: 'test-channel',
      encoder: new JsonEncoder(),
    })

    await channel.subscribe((_message) => {
      assert.fail('Should not receive the message')
    })

    await setTimeout(200)
    await channel.use().unsubscribe()
    await setTimeout(200)
    await channel.publish('test')
  })

  test('should throw and error if no bus defined', ({ assert }) => {
    const tellThem = new TellThem({
      buses: {
        memory: {
          driver: memory(),
        },
      },
    })

    const channel = tellThem.channel({
      name: 'test-channel',
      encoder: new JsonEncoder(),
    })

    assert.throws(
      () => channel.use().publish({ test: true }),
      'Cannot create an instance of bus for channel "test-channel"'
    )
  })
})
