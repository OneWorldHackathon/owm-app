import {
  ValidationError, validateSync, IsEmail, IsString, IsNotEmpty,
} from 'class-validator'
import { ValidationException } from './ValidationException'
import { DocumentData } from '@google-cloud/firestore'
import { toFirestore } from './utils'
import { FirestoreEntity } from './Repository'
/* Represents the persistence and transfer shape of a User Entity */
export type UserData = {
  readonly id: string,
  readonly email: string,
  readonly createdAt: Date,
}
export class User implements FirestoreEntity {

  @IsString()
  @IsNotEmpty()
  readonly _id: string

  @IsEmail()
  readonly email: string

  readonly createdAt: Date

  private constructor(_id: string, createdAt: Date, email: string) {
    this._id = _id
    this.email = email
    this.createdAt = createdAt
    const valid = this.validate()
    if (valid.length > 0) {
      throw new ValidationException(valid)
    }
  }

  static newInstance(id: string, email: string) {
    return new User(id, new Date, email)
  }

  toUserData(): UserData {
    return {
      id: this._id,
      email: this.email,
      createdAt: this.createdAt,
    }
  }

  static fromJSON(o: UserData) {
    return new User(o.id, o.createdAt, o.email)
  }
  toFirestore(): DocumentData {
    return toFirestore(this.toUserData())

  }
  validate(): ValidationError[] {
    return validateSync(this)
  }

  id(): string {
    return this._id
  }
}
