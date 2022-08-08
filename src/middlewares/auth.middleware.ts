import { Request, Response, NextFunction } from 'express'

import { AppError } from '../events/AppError.js'
import AppLog from '../events/AppLog.js'

import * as repository from '../repositories/auth.repository.js'

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

export { checkIfDataIsAlreadyRegistered }
