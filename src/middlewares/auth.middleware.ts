import { Request, Response, NextFunction } from 'express'

import { AppError } from '../events/AppError.js'
import AppLog from '../events/AppLog.js'

import * as repository from '../repositories/auth.repository.js'
import * as service from '../services/auth.service.js'

/* interface userProperties {
  id: number;
  email: string;
  name: string;
  surname: string;
  created_at: Date;
} */

async function checkIfDataIsAlreadyRegistered (_req: Request, res: Response, next: NextFunction) {
  const body = res.locals.body
  const { email } = body

  const data = await repository.findByEmail(email)
  if (data) {
    throw new AppError(
      'Email already registered',
      409,
      'Email already registered',
      'Ensure to provide an email address that is not already in use'
    )
  }
  AppLog('Middleware', 'Email is unique')
  next()
}

async function checkUserIsValid (_req: Request, res: Response, next: NextFunction) {
  const body = res.locals.body
  const { email, password } = body

  const userAlreadyExists = await repository.findByEmail(email)
  if (!userAlreadyExists) {
    throw new AppError(
      'User not found',
      404,
      'User not found',
      'Ensure to provide a valid email address'
    )
  }
  AppLog('Middleware', 'User exists')

  const passwordIsValid = service.decryptPassword(password, userAlreadyExists?.password)
  if (!passwordIsValid) {
    throw new AppError(
      'Invalid password',
      403,
      'Invalid password',
      'Ensure to provide a valid password'
    )
  }
  AppLog('Middleware', 'Valid password')

  res.locals.user = userAlreadyExists
  return next()
}

export { checkIfDataIsAlreadyRegistered, checkUserIsValid }
