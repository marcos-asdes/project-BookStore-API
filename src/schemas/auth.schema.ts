import Joi from 'joi'

const RegisterUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  name: Joi.string().min(3).max(100).required(),
  surname: Joi.string().min(3).max(100).required()
})

// implement addition of phone number, city and country in RegisterUser

export { RegisterUser }
