import { Request, Response, NextFunction } from 'express'

import appLog from './appLog.js'

class AppError {
  statusCode: number
  message: string
  details: string | object | string[]

  constructor (
    statusCode: number,
    message: string,
    details: string | object | string[]
  ) {
    this.statusCode = statusCode
    this.message = message
    this.details = details
  }
}

function errorHandler (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const { statusCode, message, details } = error

  appLog('Error', message)
  return error.statusCode !== 500
    ? res.status(statusCode).send({ message, details })
    : res.status(500).send({
      message: 'Internal server error',
      details: error
    })
}

export { AppError }
export default errorHandler
