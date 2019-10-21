import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CannotSignInError } from './error/CannotSignInError'
// avoid `Cannot read property 'prototype' of undefined` runtime error.
import SignInResultMiddleware from 'lib/aaa/SignInResultMiddleware'
import SignInToken from 'entities/SignInToken'
import User from 'entities/User'
import { getRepository } from 'typeorm'

@Resolver()
class SignInResolver {
  repositoryForSignInToken = getRepository(SignInToken)
  repositoryForUser = getRepository(User)

  @UseMiddleware(SignInResultMiddleware)
  @Query(returns => String, { nullable: true })
  async hello(): Promise<string> {
    return null
  }

  @UseMiddleware(SignInResultMiddleware)
  @Mutation(returns => User, { nullable: true })
  async signIn(
    @Arg('email', { nullable: true }) email?: string,
    @Arg('password', { nullable: true }) password?: string,
    @Arg('token', { nullable: true }) token?: string,
    @Arg('passphrase', { nullable: true }) passphrase?: string
  ): Promise<User> {
    console.log(
      `signIn: email: ${email}, password: ${password}, token: ${token}`
    )
    if (email) {
      return this.signInWithEmailAndPassword(email, password)
    } else if (token) {
      return this.signInWithToken(token, passphrase)
    }
    throw new CannotSignInError(`Email or token is required for sign in.`)
  }

  async signInWithEmailAndPassword(
    email: string,
    password?: string
  ): Promise<User> {
    const user = await this.repositoryForUser.findOne({ where: { email } })
    if (!user) {
      throw new CannotSignInError(
        `Cannot sign in as a valid user. Please check the email and password that your input.`
      )
    }
    if (!(await user.comparePassword(password))) {
      throw new CannotSignInError(
        `Cannot sign in as a valid user. Please check the email and password that your input.`
      )
    }
    return user
  }

  async signInWithToken(id: string, passphrase?: string): Promise<User> {
    const tokenIsInvalidError = new CannotSignInError(
      `The token must be valid.`
    )

    const signInToken = await this.repositoryForSignInToken.findOne({
      where: { id }
    })
    if (!signInToken) {
      console.log(`Cannot found the sign in token id in DB: `, id)
      throw tokenIsInvalidError
    }
    if (!signInToken.expiresAt) {
      console.log(`The expiresAt field is null.`)
      throw tokenIsInvalidError
    }
    if (!signInToken.comparePassphrase(passphrase)) {
      console.log(`The passphrase mismatch: `, passphrase)
      throw tokenIsInvalidError
    }

    const now = new Date()
    console.log(
      `The token effective until %s, now is %s.`,
      signInToken.expiresAt,
      now
    )
    if (0 >= signInToken.expiresAt.getTime() - now.getTime()) {
      throw new CannotSignInError(
        `The token is expired. Please contact your system administrator.`
      )
    }

    const userId = signInToken.userId
    const user = await this.repositoryForUser.findOne({ where: { id: userId } })
    if (!user) {
      throw new CannotSignInError(
        `Cannot found the user in the system. Please contact your system administrator.`
      )
    }
    return user
  }
}

export default SignInResolver
