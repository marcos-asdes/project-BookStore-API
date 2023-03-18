import { Router } from 'express'

import * as middleware from '../middlewares/rateLimit.middleware.js'
import * as controller from '../controllers/catalog.controller.js'

import { routeEvent } from '../events/routeEvent.js'

const catalogRouter = Router()

catalogRouter.get(
  '/catalog',
  routeEvent,
  middleware.refreshPageLimiter,
  controller.renderCatalog
)

export default catalogRouter
