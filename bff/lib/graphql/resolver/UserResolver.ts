import { Arg, Authorized, Query, Resolver } from 'type-graphql'
import Role from 'lib/aaa/role'
import User from 'entities/User'
import faker from 'faker'
import { getRepository } from 'typeorm'

@Resolver(of => User)
class UserResolver {
  repository = getRepository(User)

  @Authorized([
    {
      requiredRoles: [Role.User.Default],
      targetResource: 'SELF'
    }
  ])
  @Query(returns => User, { nullable: true })
  user(
    @Arg('id', type => String) id?: string,
    @Arg('email', type => String) email?: string
  ): User {
    const u = new User()
    u.name = faker.internet.userName()
    return u
  }

  @Authorized()
  @Query(returns => [User], { nullable: false })
  users(): Promise<User[]> {
    const users = this.repository.find()
    return users
  }
}
export default UserResolver
