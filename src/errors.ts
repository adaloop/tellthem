import { createError } from '@poppinss/utils'

export const E_FAILED_DECODE_MESSAGE = createError(
  'Failed to decode message',
  'E_FAILED_DECODE_MESSAGE'
)

export const E_FAILED_CREATE_BUS = createError(
  'Failed to create instance of bus',
  'E_FAILED_CREATE_BUS'
)

export const E_DRIVER_NOT_INITIALIZED = createError(
  'Driver not initialized',
  'E_DRIVER_NOT_INITIALIZED'
)
