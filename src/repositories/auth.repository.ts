import client from '../config/database.js'
import AppLog from '../events/AppLog.js'

async function findByEmail (email: string) {
  AppLog('Repository', 'User searched by email')

  return await client.user.findUnique({ where: { email } })
}

async function registerUser (data: any) {
  await client.user.create({ data })

  return AppLog('Repository', 'User instance inserted')
}

export { findByEmail, registerUser }
