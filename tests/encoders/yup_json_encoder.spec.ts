import { test } from '@japa/runner'
import yup from 'yup'
import { ChannelMessage } from '../../src/types/channel.js'
import { YupJsonEncoder } from '../../src/encoders/yup_json_encoder.js'

test.group('Encoders - Yup Json', () => {
  test('should encode and decode', async ({ assert }) => {
    const encoder = new YupJsonEncoder({
      schema: yup.object({
        test: yup.string().required(),
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
    const encoder = new YupJsonEncoder({
      schema: yup.object({
        test: yup.string().required(),
      }),
    })

    const decodedMessage = await encoder.decode('{"test": 123}')

    assert.isNull(decodedMessage)
  })

  test('should be typed', async ({ assert, expectTypeOf }) => {
    const encoder = new YupJsonEncoder({
      schema: yup.object({
        test: yup.string().required(),
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
