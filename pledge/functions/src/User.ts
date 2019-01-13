import {
  IsEmail, IsString, IsNotEmpty, IsDate, IsOptional, IsInt, IsUrl,
} from 'class-validator'
import { ValidationException } from './ValidationException'
import { DocumentData } from '@google-cloud/firestore'
import { toFirestore, removeUndefinedProperties } from './utils'

import { EntityBase } from './EntityBase'
import { Location } from './PledgeForm'
/* Represents the persistence and transfer shape of a User Entity */
export type UserData = {
  readonly id: string,
  readonly email: string,
  readonly displayName: string,
  readonly profileURL: string | undefined,
  readonly createdAt: Date,
  readonly yearOfBirth: number | undefined,
  readonly location: Location | undefined,
}
export class User extends EntityBase {

  @IsEmail()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  displayName: string

  @IsDate()
  readonly createdAt: Date

  @IsOptional()
  @IsUrl()
  readonly profileURL: string | undefined

  @IsOptional()
  @IsInt()
  yearOfBirth: number | undefined

  @IsOptional()
  location: Location | undefined

  private constructor(_id: string, createdAt: Date, email: string,
                      displayName: string, profileURL?: string) {

    super(_id)
    this.email = email
    this.createdAt = createdAt
    this.displayName = displayName
    this.profileURL = profileURL
    const valid = this.validate()
    if (valid.length > 0) {
      console.log(valid)
      throw new ValidationException(valid)
    }
  }

  static newInstance(id: string, email: string, displayName: string, profileURL?: string) {
    return new User(id, new Date, email, displayName, profileURL)
  }

  toUserData(): UserData {
    const o: UserData = {
      id: this.id(),
      email: this.email,
      createdAt: this.createdAt,
      displayName: this.displayName,
      profileURL: this.profileURL,
      yearOfBirth: this.yearOfBirth,
      location: this.location,
    }
    return removeUndefinedProperties(o) as UserData
  }

  static fromJSON(o: UserData) {
    const user = new User(o.id, o.createdAt, o.email, o.displayName, o.profileURL)
    user.location = o.location
    user.yearOfBirth = o.yearOfBirth
    return user
  }

  toFirestore(): DocumentData {
    return toFirestore(this.toUserData())

  }

}
