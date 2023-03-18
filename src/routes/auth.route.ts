import { Router } from 'express'

import * as schema from '../schemas/auth.schema.js'
import * as controller from '../controllers/auth.controller.js'

import { validateSchemaMiddleware } from '../middlewares/schema.middleware.js'
import { routeEvent } from '../events/routeEvent.js'

const authRouter = Router()

authRouter.post(
  '/sign-up',
  routeEvent,
  validateSchemaMiddleware(schema.RegisterUser),
  controller.registerUser
)

authRouter.post(
  '/sign-in',
  routeEvent,
  validateSchemaMiddleware(schema.SignIn),
  controller.loginUser
)

export default authRouter
