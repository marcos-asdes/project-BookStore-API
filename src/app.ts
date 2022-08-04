import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import 'express-async-errors'

import router from './routes/index.js'
import errorHandler from './events/appError.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(json())
app.use(helmet())
app.use(router)
app.use(errorHandler)

export default app
