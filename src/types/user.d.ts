import { User } from '@prisma/client'

export type SignUp = Omit<User, 'id' | 'created_at'>

export type SignIn = Pick<User, 'email' | 'password'>