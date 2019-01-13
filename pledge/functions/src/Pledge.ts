import { v4 as uuid } from 'uuid'
import {
  Min, Max, IsNotEmpty, IsString,
} from 'class-validator'
import { ValidationException } from './ValidationException'
import { Conversions } from './Conversions'
import { toFirestore } from './utils'
import { DocumentData } from '@google-cloud/firestore'
import { EntityBase } from './EntityBase'
import { Location } from './PledgeForm'
/* Represents the persistence and transfer shape of a Pledge Entity */
export type PledgeData = {
  readonly id: string,
  readonly userId: string,
  readonly distanceMetres: number,
  readonly location: Location,
}
export class Pledge extends EntityBase {

  @Min(100) @Max(42164.8128)
  private readonly _distanceMetres: number
  readonly location: Location

  @IsString()
  @IsNotEmpty()
  private readonly _userId: string
  private constructor(_id: string, userId: string, distanceMetres: number, location: Location) {
    super(_id)
    this._distanceMetres = distanceMetres
    this._userId = userId
    this.location = location
    const valid = this.validate()
    if (valid.length > 0) {
      throw new ValidationException(valid)
    }
  }

  /**
  * New up a non persisted Pledge
  */
  static newInstance(userId: string, distanceMetres: number, location: Location) {
    return new Pledge(uuid(), userId, distanceMetres, location)
  }

  static fromJSON(o: PledgeData) {
    return this.newInstance(o.userId, o.distanceMetres, o.location)
  }

  get userId(): string {
    return this._userId
  }

  get distanceKm(): number {
    return Conversions.metresToKilometres(this._distanceMetres)
  }

  get distanceMiles(): number {
    return Conversions.metresToMiles(this._distanceMetres)
  }

  toPledgeData(): PledgeData {
    return {
      id: this.id(),
      userId: this._userId,
      distanceMetres: this._distanceMetres,
      location: this.location,
    }
  }

  toFirestore(): DocumentData {
    return toFirestore(this.toPledgeData())
  }

}
