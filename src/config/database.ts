import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

import AppLog from '../events/AppLog.js'

dotenv.config()

const client = new PrismaClient()
connectToDatabase()

async function connectToDatabase () {
  try {
    await client.$connect()
    AppLog('Server', 'Connected to database')
  } catch (error) {
    AppLog('Error', `${error}`)
  }
}

export default client
