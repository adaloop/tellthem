import { test } from '@japa/runner'
import { ChannelMessage } from '../../src/types/channel.js'
import { VineJsonEncoder } from '../../src/encoders/vine_json_encoder.js'
import vine from '@vinejs/vine'

test.group('Encoders - Vine Json', () => {
  test('should encode and decode', async ({ assert }) => {
    const encoder = new VineJsonEncoder({
      schema: vine.object({
        test: vine.string(),
      }),
    })

    const payload = {
      test: 'test',
    }

    const encodedMessage = encoder.encode({
      payload,
    })
    const decodedMessage = await encoder.decode(encodedMessage)

    assert.isNotNull(decodedMessage)
    assert.deepEqual(payload, decodedMessage?.payload)
  })

  test('should not decode', async ({ assert }) => {
    const encoder = new VineJsonEncoder({
      schema: vine.object({
        test: vine.string(),
      }),
    })

    const decodedMessage = await encoder.decode('{"test": 123}')

    assert.isNull(decodedMessage)
  })

  test('should be typed', async ({ assert, expectTypeOf }) => {
    const encoder = new VineJsonEncoder({
      schema: vine.object({
        test: vine.string(),
      }),
    })

    const decodedMessage = await encoder.decode(encoder.encode({ payload: { test: 'test' } }))

    if (!decodedMessage) {
      assert.fail('Decoded message should not be null')
      return
    }

    expectTypeOf(encoder.encode).parameter(0).toEqualTypeOf<ChannelMessage<{ test: string }>>()
    expectTypeOf(decodedMessage).toEqualTypeOf<ChannelMessage<{ test: string }>>()
  })
})
