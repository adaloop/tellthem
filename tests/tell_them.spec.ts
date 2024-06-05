import { test } from '@japa/runner'
import { TellThem } from '../src/tell_them.js'
import { memory } from '../src/drivers/memory.js'
import { jsonEncoder } from '../src/encoders/json_encoder.js'
import { Channel } from '../src/channel.js'

test.group('TellThem', () => {
  test('bus name should be typed', ({ expectTypeOf }) => {
    const tellThem = new TellThem({
      buses: {
        memory1: {
          driver: memory(),
        },
        memory2: {
          driver: memory(),
        },
      },
    })

    expectTypeOf(tellThem.getBus).parameter(0).toEqualTypeOf<'memory1' | 'memory2'>()
  })

  test('should create a channel', ({ assert }) => {
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
      encoder: jsonEncoder(),
    })

    assert.instanceOf(channel, Channel)
  })

  test('should cache bus', ({ assert }) => {
    const tellThem = new TellThem({
      buses: {
        memory: {
          driver: memory(),
        },
      },
    })

    const bus1 = tellThem.getBus('memory')
    const bus2 = tellThem.getBus('memory')

    assert.strictEqual(bus1, bus2)
  })
})
