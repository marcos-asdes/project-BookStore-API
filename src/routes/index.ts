import express from 'express'

import authRouter from './auth.route.js'

const router = express.Router()

router.use(authRouter)

export default router
