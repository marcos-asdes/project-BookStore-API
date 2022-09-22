import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

import appLog from '../events/appLog.js'

dotenv.config()

const client = new PrismaClient()
connectToDatabase()

async function connectToDatabase () {
  try {
    await client.$connect()
    appLog('Server', 'Connected to database')
  } catch (error) {
    appLog('Error', `${error}`)
  }
}

export default client
