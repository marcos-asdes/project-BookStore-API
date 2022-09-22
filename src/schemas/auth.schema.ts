import Joi from 'joi'

const RegisterUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  name: Joi.string().min(3).max(100).required(),
  surname: Joi.string().min(3).max(100).required()
})
// I'll implement addition of phone number, city and country in RegisterUser
// I'll implement google sign up

const SignIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required()
})
// I'll implement google sign in

export { RegisterUser, SignIn }
