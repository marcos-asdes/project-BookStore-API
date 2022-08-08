import { Request, Response } from 'express'

import AppLog from '../events/AppLog.js'

import * as repository from '../repositories/auth.repository.js'
import * as service from '../services/auth.service.js'

async function registerUser (_req: Request, res: Response) {
  const body = res.locals.body
  const password = service.hashPassword(body.password)

  const data = { ...body, password }
  await repository.registerUser(data)

  AppLog('Controller', 'User signed up')
  return res.sendStatus(201)
}

export { registerUser }
