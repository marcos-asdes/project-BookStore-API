import Cryptr from 'cryptr'
import jwt, { Algorithm, SignOptions } from 'jsonwebtoken'

import appLog from '../events/appLog.js'

const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

function encryptPassword (password: string) {
  const encryptedPassword = cryptr.encrypt(password)
  appLog('Util', 'Password encrypted')
  return encryptedPassword
}

function decryptPassword (password: string) {
  const decryptedPassword = cryptr.decrypt(password)
  appLog('Util', 'Password decrypted')
  return decryptedPassword
}

function generateToken (id: number) {
  const data = {}
  const subject = id.toString()
  const secretKey = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN

  const algorithm = process.env.JWT_ALGORITHM as Algorithm
  const config: SignOptions = { algorithm, expiresIn, subject }

  const token = jwt.sign(data, secretKey, config)

  appLog('Util', 'Token generated')
  return token
}

export const userUtils = {
  encryptPassword,
  decryptPassword,
  generateToken
}