import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
class UserGroup {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({
    unique: true
  })
  name: string

  @Field()
  @Column({
    unique: true
  })
  displayName: string
}
export default UserGroup
