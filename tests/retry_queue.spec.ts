import { test } from '@japa/runner'
import { RetryQueue } from '../src/retry_queue.js'
import { jsonEncoder } from '../src/encoders/json_encoder.js'

test.group('Retry Queue', () => {
  test('should enqueue message to retry queue', ({ assert }) => {
    const retryQueue = new RetryQueue({
      enabled: true,
    })

    const wasAdded = retryQueue.enqueue('test-channel', jsonEncoder(), { payload: 'test' })

    assert.isTrue(wasAdded)
    assert.equal(retryQueue.size(), 1)
  })

  test('should process message from retry queue', async ({ assert }, done) => {
    const retryQueue = new RetryQueue({
      enabled: true,
    })

    retryQueue.enqueue('test-channel', jsonEncoder(), { payload: 'test' })

    assert.equal(retryQueue.size(), 1)

    await retryQueue.process(async (channel, _encoder, message) => {
      assert.equal(channel, 'test-channel')
      assert.deepEqual(message, { payload: 'test' })
      done()

      return true
    })

    assert.equal(retryQueue.size(), 0)
  }).waitForDone()

  test('should not enqueue message if max size is reached', ({ assert }) => {
    const retryQueue = new RetryQueue({
      enabled: true,
      maxSize: 2,
    })

    const wasAdded1 = retryQueue.enqueue('test-channel', jsonEncoder(), { payload: 'test' })
    const wasAdded2 = retryQueue.enqueue('test-channel', jsonEncoder(), { payload: 'test' })
    const wasAdded3 = retryQueue.enqueue('test-channel', jsonEncoder(), { payload: 'test' })

    assert.isTrue(wasAdded1)
    assert.isTrue(wasAdded2)
    assert.isFalse(wasAdded3)

    assert.equal(retryQueue.size(), 2)
  })

  test('should not enqueue message if not enabled', ({ assert }) => {
    const retryQueue = new RetryQueue({
      enabled: false,
    })

    const wasAdded = retryQueue.enqueue('test-channel', jsonEncoder(), { payload: 'test' })

    assert.isFalse(wasAdded)
    assert.equal(retryQueue.size(), 0)
  })
})
