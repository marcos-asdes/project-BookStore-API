import appLog from '../events/appLog.js'
import { AppError } from '../events/appError.js'
import { authRepository } from '../repositories/auth.repository.js'
import { SignUp } from '../types/user.d.js'
import { userUtils } from '../utils/user.js'

// sign up services
async function checkIfEmailIsAlreadyRegistered (email: string) {
  const data = await authRepository.findUserByEmail(email)
  if (data) {
    throw new AppError(
      409,
      'Email already registered',
      'Ensure to provide an email address that is not already in use'
    )
  }
  return appLog('Service', 'Email is unique')
}

async function registerUser (data: SignUp) {
  await authRepository.registerUser(data)
  return appLog('Service', '...')
}

// sign in services
async function checkIfUserIsValid (email: string, password: string) {

  const userId = await checkIfUserAlreadyExists(email)

  const decryptedPassword = userUtils.decryptPassword(password)
  comparePasswords(password, decryptedPassword)

  return userId
}

async function checkIfUserAlreadyExists (email: string) {
  const userAlreadyExists = await authRepository.findUserByEmail(email)
  // TESTAR CONDICIONAL
  if (!userAlreadyExists) {
    throw new AppError(
      404,
      'User not found',
      'Ensure to provide a valid email address'
    )
  }
  appLog('Middleware', 'User exists')
  return userAlreadyExists.id
}

function comparePasswords (password: string, decryptedPassword: string) {
  if (password !== decryptedPassword) {
    throw new AppError(
      403,
      'Invalid password',
      'Ensure to provide a valid password'
    )
  }
  return appLog('Service', 'Valid password')
}

function generateToken (id: number) {
  return userUtils.generateToken(id)
}

function encryptPassword(password: string) {
  return userUtils.encryptPassword(password)
}

export const authService = {
  checkIfEmailIsAlreadyRegistered,
  encryptPassword,
  registerUser,
  checkIfUserIsValid,
  generateToken
}
