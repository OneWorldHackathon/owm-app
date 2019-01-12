import { v4 as uuid } from 'uuid'
import {
  IsUUID, ValidationError, validateSync,
} from 'class-validator'
import { ValidationException } from './ValidationException'
/* Represents the persistence and transfer shape of a Pledge Entity */
export type PledgeData = {
  readonly id: string,
  readonly distanceMetres: number,
}
export class Pledge {

  @IsUUID('4')
  readonly id: string

  readonly distanceMetres: number

  private constructor(id: string, distanceMetres: number) {
    this.id = id
    this.distanceMetres = distanceMetres
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
}
