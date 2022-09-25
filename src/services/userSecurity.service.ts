import bcrypt from 'bcrypt'
import jwt, { Algorithm, SignOptions } from 'jsonwebtoken'

import appLog from '../events/appLog.js'

function encryptPassword (password: string) {
  const encryptedPassword = bcrypt.hashSync(password, +process.env.SALT)
  appLog('Service', 'Password encrypted')
  return encryptedPassword
}

function comparePasswords (password: string, encryptedPassword: string) {
  const passwordIsValid = bcrypt.compareSync(password, encryptedPassword)
  appLog('Service', 'Password checked')
  return passwordIsValid
}

function generateToken (id: number) {
  const data = {}
  const subject = id.toString()
  const secretKey = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN

  const algorithm = process.env.JWT_ALGORITHM as Algorithm
  const config: SignOptions = { algorithm, expiresIn, subject }

  const token = jwt.sign(data, secretKey, config)

  appLog('Service', 'Token generated')
  return token
}

export const userSecurityService = {
  encryptPassword,
  comparePasswords,
  generateToken
}

/* 
import Cryptr from 'cryptr'

const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

function encryptPassword (password: string) {
  const encryptedPassword = cryptr.encrypt(password)
  appLog('Service', 'Password encrypted')
  return encryptedPassword
}

function decryptPassword (password: string) {
  const decryptedPassword = cryptr.decrypt(password)
  appLog('Service', 'Password decrypted')
  return decryptedPassword
}

function comparePasswords (password: string, decryptedPassword: string) {
  if (password !== decryptedPassword) {
    throw new AppError(
      401,
      'Invalid password',
      'Ensure to provide a valid password'
    )
  }
  return appLog('Service', 'Valid password')
} 
*/
