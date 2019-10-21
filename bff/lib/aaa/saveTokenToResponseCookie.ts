import { HoursToMilliseconds } from 'lib/datetime/const'
import { Response } from 'express'

export const saveTokenToResponseCookie = (
  response: Response,
  token: string
): void => {
  response.cookie('token', token, {
    maxAge: 7 /* days */ * 24 * HoursToMilliseconds,
    secure: true,
    httpOnly: true
  })
}
