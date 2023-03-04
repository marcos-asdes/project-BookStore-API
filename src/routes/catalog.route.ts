import { Router } from 'express'

import * as controller from '../controllers/catalog.controller.js'

const catalogRouter = Router()

catalogRouter.get(
  '/catalog',
  controller.renderCatalog
)

export default catalogRouter
