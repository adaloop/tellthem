import { test } from '@japa/runner'
import { TyBus } from '../src/ty_bus.js'
import { memoru } from '../src/drivers/memory.js'

test.group('TyBus', () => {
  test('should cache bus', ({ assert }) => {
    const tyBus = new TyBus({
      default: 'memory',
      services: {
        memory: {
          driver: memoru(),
        },
      },
    })

    const bus1 = tyBus.getBus('memory')
    const bus2 = tyBus.getBus('memory')

    assert.equal(bus1, bus2)
  })
})
