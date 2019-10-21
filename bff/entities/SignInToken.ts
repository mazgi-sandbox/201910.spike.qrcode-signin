import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { decryptByMasterSecret, encryptByMasterSecret } from 'lib/cipher'
import ValidationError from 'lib/validator/ValidationError'
import validatePassword from 'lib/validator/validatePassword'

@ObjectType()
@Entity()
class SignInToken {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  @Index()
  userId: string

  @Column({
    nullable: true
  })
  encryptedPassphrase: string

  // volatile field
  @Field({ nullable: true })
  passphrase: string

  @Field()
  @Column()
  expiresAt: Date

  @BeforeInsert()
  @BeforeUpdate()
  updatePassphrase: () => Promise<void> = async () => {
    if (!this.passphrase) {
      return
    }
    const validationErrors = validatePassword(this.passphrase)
    if (validationErrors.length > 0) {
      throw new ValidationError(
        `Validation failed. ${JSON.stringify(validationErrors)}`,
        validationErrors
      )
    }
    this.encryptedPassphrase = await encryptByMasterSecret(this.passphrase)
  }

  @AfterLoad()
  loadPassphrase: () => Promise<void> = async () => {
    const encrypted = this.encryptedPassphrase
    if (encrypted) {
      this.passphrase = await decryptByMasterSecret(encrypted)
    }
  }

  comparePassphrase: (
    plainTextPassphrase: string
  ) => Promise<boolean> = async plainTextPassword => {
    return this.passphrase === plainTextPassword
  }
}
export default SignInToken
