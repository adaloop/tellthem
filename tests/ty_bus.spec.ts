import { test } from '@japa/runner'
import { TyBus } from '../src/ty_bus.js'
import { ZodJsonEncoder } from '../src/encoders/zod_json_encoder.js'
import { z } from 'zod'

test.group('TyBus', () => {
  test('test typing', () => {
    const tyBus = new TyBus({
      default: 'memory',
      services: {
        memory: {
          driver: {},
        },
      },
    })

    const testChannel = tyBus.channel({
      name: 'test-channel',
      encoder: new ZodJsonEncoder({
        schema: z.object({
          test: z.string(),
        }),
      }),
    })

    testChannel.use('memory').publish({ test: 'test' })
    testChannel.publish({ test: 'test' })
  })
})
