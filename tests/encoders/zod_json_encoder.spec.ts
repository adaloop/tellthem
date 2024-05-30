import { test } from '@japa/runner'
import { TyBus } from '../../src/ty_bus.js'
import { ZodJsonEncoder } from '../../src/encoders/zod_json_encoder.js'
import { z } from 'zod'

test.group('Encoders - Zod Json Encoder', () => {
  const tyBus = new TyBus({
    default: 'memory',
    services: {
      memory: {
        driver: {},
      },
    },
  })

  test('should encode and decode', ({ assert }) => {
    const encoder = new ZodJsonEncoder({
      schema: z.object({
        test: z.string(),
      }),
    })

    const payload = {
      test: 'test',
    }

    const encodedMessage = encoder.encode({
      payload: payload,
    })
    const decodedMessage = encoder.decode(encodedMessage)

    assert.deepEqual({ payload }, decodedMessage)
  })

  test('decode should return null with wrong payload', ({ assert }) => {
    const encoder = new ZodJsonEncoder({
      schema: z.object({
        test: z.string(),
      }),
    })

    const decodedMessage = encoder.decode('{"payload":{}}')

    assert.isNull(decodedMessage)
  })

  test('payload should be typesafe', ({ expectTypeOf }) => {
    const testChannel = tyBus.channel({
      name: 'test',
      encoder: new ZodJsonEncoder({
        schema: z.object({
          test: z.string(),
        }),
      }),
    })

    expectTypeOf(testChannel.publish).parameter(0).toEqualTypeOf<{ test: string }>()
    expectTypeOf(testChannel.subscribe)
      .parameter(0)
      .toEqualTypeOf<(data: { test: string }) => void>()
  })
})
