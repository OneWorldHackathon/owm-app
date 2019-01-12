import {
  IsEmail, IsString, IsNotEmpty,
} from 'class-validator'
import { ValidationException } from './ValidationException'
import { DocumentData } from '@google-cloud/firestore'
import { toFirestore, removeUndefinedProperties } from './utils'

import { EntityBase } from './EntityBase'
/* Represents the persistence and transfer shape of a User Entity */
export type UserData = {
  readonly id: string,
  readonly email: string,
  readonly displayName: string,
  readonly createdAt: Date,
  readonly lastName: string | undefined,
  readonly firstName: string | undefined,
}
export class User extends EntityBase {

  @IsEmail()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  readonly displayName: string

  readonly createdAt: Date

  _firstName: string | undefined
  _lastName: string | undefined

  private constructor(_id: string, createdAt: Date, email: string, displayName: string) {

    super(_id)
    this.email = email
    this.createdAt = createdAt
    this.displayName = displayName
    const valid = this.validate()
    if (valid.length > 0) {
      throw new ValidationException(valid)
    }
  }

  static newInstance(id: string, email: string, displayName: string) {
    return new User(id, new Date, email, displayName)
  }

  set firstName(val: string) {
    this.firstName = val
  }

  set lastName(val: string) {
    this.lastName = val
  }

  toUserData(): UserData {
    const o: UserData = {
      id: this.id(),
      email: this.email,
      createdAt: this.createdAt,
      displayName: this.displayName,
      lastName: this._lastName,
      firstName: this._firstName,
    }
    return removeUndefinedProperties(o) as UserData
  }

  static fromJSON(o: UserData) {
    return new User(o.id, o.createdAt, o.email, o.displayName)
  }

  toFirestore(): DocumentData {
    return toFirestore(this.toUserData())

  }

}
