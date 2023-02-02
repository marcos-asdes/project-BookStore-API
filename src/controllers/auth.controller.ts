import { Request, Response } from 'express'

import appLog from '../events/appLog.js'
import { authService } from '../services/auth.service.js'
import { SignIn, SignUp } from '../types/user.d.js'

async function registerUser(_req: Request, res: Response) {
  const body: SignUp = res.locals.body
  const { email, password, name, surname, phone } = body
  // checks if the email entered for registration is already in the database
  await authService.checkIfEmailIsAlreadyRegistered(email)
  // encrypt the password
  const encryptedPassword = authService.encryptPassword(password)
  // creates the data object to be stored in the database
  const data = {
    email: email,
    password: encryptedPassword,
    name: name,
    surname: surname,
    phone: phone
  }
  // stores the data object in the database
  await authService.registerUser(data)
  appLog('Controller', 'User signed up')
  return res.sendStatus(201)
}

async function loginUser(_req: Request, res: Response) {
  const body: SignIn = res.locals.body
  const { email, password } = body

  const data = await authService.checkIfUserAlreadyExists(email)
  const { id } = data
  const databasePassword = data.password
  const inputedPassword = password

  authService.comparePasswords(inputedPassword, databasePassword)

  const token = authService.generateToken(id)

  appLog('Controller', 'User signed in')
  return res.status(200).send({ token })
}

export { registerUser, loginUser }
