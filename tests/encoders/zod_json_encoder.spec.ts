import { test } from '@japa/runner'
import { ZodJsonEncoder } from '../../src/encoders/zod_json_encoder.js'
import { z } from 'zod'
import { ChannelMessage } from '../../src/types/channel.js'

test.group('Encoders - Zod Json', () => {
  test('should encode and decode', async ({ assert }) => {
    const encoder = new ZodJsonEncoder({
      schema: z.object({
        test: z.string(),
      }),
    })

    const payload = {
      test: 'test',
    }

    const encodedMessage = encoder.encode({
      payload,
    })
    const decodedMessage = encoder.decode(encodedMessage)

    assert.isNotNull(decodedMessage)
    assert.deepEqual(payload, decodedMessage?.payload)
  })

  test('should not decode', ({ assert }) => {
    const encoder = new ZodJsonEncoder({
      schema: z.object({
        test: z.string(),
      }),
    })

    const decodedMessage = encoder.decode('{"test": 123}')

    assert.isNull(decodedMessage)
  })

  test('should be typed', ({ assert, expectTypeOf }) => {
    const encoder = new ZodJsonEncoder({
      schema: z.object({
        test: z.string(),
      }),
    })

    const decodedMessage = encoder.decode(encoder.encode({ payload: { test: 'test' } }))

    if (!decodedMessage) {
      assert.fail('Decoded message should not be null')
      return
    }

    expectTypeOf(encoder.encode).parameter(0).toEqualTypeOf<ChannelMessage<{ test: string }>>()
    expectTypeOf(decodedMessage).toEqualTypeOf<ChannelMessage<{ test: string }>>()
  })
})
