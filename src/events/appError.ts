import { Request, Response, NextFunction } from 'express'

import appLog from './appLog.js'

class AppError {
  log: string
  statusCode: number
  message: string
  details: string | {} | string[]

  constructor (
    log: string,
    statusCode: number,
    message: string,
    details: string | {} | string[]
  ) {
    this.log = log
    this.statusCode = statusCode
    this.message = message
    this.details = details
  }
}

function errorHandler (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { log, statusCode, message, details } = error

  appLog('Error', log ?? message)
  return error.statusCode !== 500
    ? res.status(statusCode).send({ message, details })
    : res.status(500).send({
      message: 'Internal server error',
      details: error
    })
}

export { AppError }
export default errorHandler
