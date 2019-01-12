import {
  IsEmail, IsString, IsNotEmpty, IsDate, IsOptional, IsInt, IsUrl,
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
  readonly profileUrl: string | undefined,
  readonly createdAt: Date,
  readonly lastName: string | undefined,
  readonly firstName: string | undefined,
  readonly yearOfBirth: number | undefined,
}
export class User extends EntityBase {

  @IsEmail()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  readonly displayName: string

  @IsDate()
  readonly createdAt: Date

  @IsOptional()
  @IsUrl()
  readonly profileURL: string | undefined

  @IsOptional()
  @IsString()
  _firstName: string | undefined

  @IsOptional()
  @IsString()
  _lastName: string | undefined

  @IsOptional()
  @IsInt()
  _yearOfBirth: number | undefined

  private constructor(_id: string, createdAt: Date, email: string,
                      displayName: string, profileURL?: string) {

    super(_id)
    this.email = email
    this.createdAt = createdAt
    this.displayName = displayName
    this.profileURL = profileURL
    const valid = this.validate()
    if (valid.length > 0) {
      throw new ValidationException(valid)
    }
  }

  static newInstance(id: string, email: string, displayName: string, profileURL: string) {
    return new User(id, new Date, email, displayName, profileURL)
  }

  set firstName(val: string) {
    this.firstName = val
  }

  set lastName(val: string) {
    this.lastName = val
  }

  set yearOfBirth(val: number) {
    this.yearOfBirth = val
  }

  toUserData(): UserData {
    const o: UserData = {
      id: this.id(),
      email: this.email,
      createdAt: this.createdAt,
      displayName: this.displayName,
      profileUrl: this.profileURL,
      lastName: this._lastName,
      firstName: this._firstName,
      yearOfBirth: this._yearOfBirth,
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
