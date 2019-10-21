import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'
import { CannotSignInError } from './error/CannotSignInError'
import { HoursToMilliseconds } from 'lib/datetime/const'
import SignInToken from 'entities/SignInToken'
import User from 'entities/User'
import { getRepository } from 'typeorm'

@Resolver()
class SignInTokenResolver {
  repositoryForSignInToken = getRepository(SignInToken)
  repositoryForUser = getRepository(User)

  @Authorized() //TODO: role
  @Mutation(returns => SignInToken)
  async getSignInToken(
    @Arg('userId', { nullable: true }) userId?: string,
    @Arg('email', { nullable: true }) email?: string,
    @Arg('password', { nullable: true }) password?: string
  ): Promise<SignInToken> {
    console.log(`userId: ${userId}, email: ${email}, password: ${password}`)
    let user
    if (userId) {
      user = await this.repositoryForUser.findOne({ where: { id: userId } })
    } else if (email) {
      user = await this.repositoryForUser.findOne({ where: { email } })
    } else {
      // userId === null && email === null
      throw new CannotSignInError(
        `User id or email is required to get the sign-in token.`
      )
    }
    console.log(`user: `, user)
    if (!user) {
      console.log(`user is null.`)
      throw new CannotSignInError(
        `It cannot verify as a valid user. Please check the email and password that your input.`
      )
    }
    if (!(await user.comparePassword(password))) {
      console.log(`password is wrong.`)
      throw new CannotSignInError(
        `It cannot verify as a valid user. Please check the email and password that your input.`
      )
    }
    console.log(`user: `, user)

    //TODO: role verification

    // get sign in token if it exist.
    const signInToken = await this.repositoryForSignInToken.findOne({
      where: { userId: user.id }
    })
    console.log(`signInToken: `, signInToken)

    //TODO: re-generate if it expired.

    // return token if it exist.
    if (signInToken) {
      return signInToken
    }

    // generate the new token.
    const newSignInToken = await this.repositoryForSignInToken.create()
    newSignInToken.userId = user.id
    newSignInToken.expiresAt = new Date(Date.now() + HoursToMilliseconds * 24)
    await this.repositoryForSignInToken.save(newSignInToken)
    console.log(`newSignInToken: `, newSignInToken)
    return newSignInToken
  }
}
export default SignInTokenResolver
