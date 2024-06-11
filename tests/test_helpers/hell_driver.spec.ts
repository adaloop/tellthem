import { test } from '@japa/runner'
import { HellDriver } from '../../src/test_helpers/hell_driver.js'
import { MemoryDriver } from '../../src/drivers/memory.js'
import { jsonEncoder } from '../../src/encoders/json_encoder.js'

test.group('Test Helpers - HellDriver', () => {
  test('should always fail', ({ assert }) => {
    const driver = new HellDriver(new MemoryDriver())

    driver.alwaysFail()

    assert.throws(() => driver.publish('test', jsonEncoder(), { payload: 'test' }))
  })

  test('should always succeed', ({ assert }) => {
    const driver = new HellDriver(new MemoryDriver())

    driver.alwaysSuccess()

    assert.doesNotThrow(
      async () => await driver.publish('test', jsonEncoder(), { payload: 'test' })
    )
  })

  test('should fail randomly', async ({ assert }) => {
    const driver = new HellDriver(new MemoryDriver())

    driver.randomFail()

    let failProbability: number = 0

    try {
      await driver.publish('test', jsonEncoder(), { payload: 'test' })
      failProbability = driver.failProbability()
      await driver.publish('test', jsonEncoder(), { payload: 'test' })
    } catch {}

    assert.notEqual(failProbability, driver.failProbability())
  })
})
