import express from 'express'

import authRouter from './auth.route.js'
import catalogRouter from './catalog.route.js'

const router = express.Router()
const api = '/api'

router.use(api, authRouter)
router.use(api, catalogRouter)

export default router
