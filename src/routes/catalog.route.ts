import { Router } from 'express'

import * as middleware from '../middlewares/rateLimit.middleware.js'
import * as controller from '../controllers/catalog.controller.js'

const catalogRouter = Router()

catalogRouter.get(
  '/catalog',
  middleware.refreshPageLimiter,
  controller.renderCatalog
)

export default catalogRouter
