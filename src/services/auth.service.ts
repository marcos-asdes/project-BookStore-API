import appLog from '../events/appLog.js'
import { AppError } from '../events/appError.js'
import { authRepository } from '../repositories/auth.repository.js'
import { SignUp } from '../types/user.d.js'
import { userSecurityService } from './userSecurity.service.js'

// sign up services
async function checkIfEmailIsAlreadyRegistered(email: string) {
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

function encryptPassword(password: string) {
  return userSecurityService.encryptPassword(password)
}

async function registerUser(data: SignUp) {
  await authRepository.registerUser(data)
  return appLog('Service', 'User created')
}

// sign in services
async function checkIfUserAlreadyExists(email: string) {
  const data = await authRepository.findUserByEmail(email)
  // TESTAR CONDICIONAL
  if (!data) {
    throw new AppError(
      404,
      'User not found',
      'Ensure to provide a valid email address'
    )
  }
  appLog('Middleware', 'User exists')
  return data
}

function comparePasswords(inputedPassword: string, databasePassword: string) {
  const passwordIsValid = userSecurityService.comparePasswords(inputedPassword, databasePassword)
  if (!passwordIsValid) {
    throw new AppError(
      401,
      'Invalid password',
      'Ensure to provide a valid password'
    )
  }
  return appLog('Service', 'Valid password')
}

function generateToken(id: number) {
  return userSecurityService.generateToken(id)
}

export const authService = {
  checkIfEmailIsAlreadyRegistered,
  encryptPassword,
  registerUser,
  checkIfUserAlreadyExists,
  comparePasswords,
  generateToken
}
