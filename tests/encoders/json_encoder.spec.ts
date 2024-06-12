import { test } from '@japa/runner'
import { JsonEncoder } from '../../src/encoders/json_encoder.js'

test.group('Encoders - Json', () => {
  test('should encode and decode', async ({ assert }) => {
    const encoder = new JsonEncoder()

    const payload = {
      test: 'test',
    }

    const encodedMessage = encoder.encode({
      payload: payload,
    })
    const decodedMessage = await encoder.decode(encodedMessage)

    assert.deepEqual({ payload }, decodedMessage)
  })

  test('should not decode', async ({ assert }) => {
    const encoder = new JsonEncoder()

    const decodedMessage = await encoder.decode('"')

    assert.isNull(decodedMessage)
  })
})
