import { v4 as uuid } from 'uuid'
import {
  IsUUID, ValidationError, validateSync, Min, Max,
} from 'class-validator'
import { ValidationException } from './ValidationException'
import { Conversions } from './Conversions'
/* Represents the persistence and transfer shape of a Pledge Entity */
export type PledgeData = {
  readonly id: string,
  readonly distanceMetres: number,
}
export class Pledge {

  @IsUUID('4')
  readonly id: string

  @Min(500) @Max(42164.8128)
  private readonly _distanceMetres: number

  private constructor(id: string, distanceMetres: number) {
    this.id = id
    this._distanceMetres = distanceMetres
    const valid = this.validate()
    if (valid.length > 0) {
      throw new ValidationException(valid)
    }
  }

  static newInstance(distanceMetres: number) {
    return new Pledge(uuid(), distanceMetres)
  }

  static fromJSON(o: PledgeData) {
    return this.newInstance(o.distanceMetres)
  }

  validate(): ValidationError[] {
    return validateSync(this)
  }

  get distanceKm(): number {
    return Conversions.metresToKilometres(this._distanceMetres)
  }

  get distanceMiles(): number {
    return Conversions.metresToMiles(this._distanceMetres)
  }
}
