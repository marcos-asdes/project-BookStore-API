import bcrypt from 'bcrypt'

import AppLog from '../events/AppLog.js'

function hashPassword (password: string) {
  const encrypted = bcrypt.hashSync(password, +process.env.SALT)

  AppLog('Service', 'Password encrypted')
  return encrypted
}

export { hashPassword }
