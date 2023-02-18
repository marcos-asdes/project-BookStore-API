import express from 'express'

import authRouter from './auth.route.js'

const router = express.Router()
const api = '/api'

router.use(api, authRouter)

export default router
