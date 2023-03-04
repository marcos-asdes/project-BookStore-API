import client from '../config/database.js'

import { SignUp } from '../types/user.d.js'

import appLog from '../events/appLog.js'

async function findUserByEmail(email: string) {
  const user = await client.user.findUnique({ where: { email } })
  appLog('Repository', 'Performed user search by e-mail')
  return user
}

async function registerUser(data: SignUp) {
  await client.user.create({ data })
  return appLog('Repository', 'User instance inserted')
}

export const authRepository = {
  findUserByEmail,
  registerUser
}
