import { v4 as uuid } from 'uuid'
import {
  IsUUID, ValidationError, validateSync,
} from 'class-validator'
import { ValidationException } from './ValidationException'
/* Represents the persistence and transfer shape of a Pledge Entity */
export type PledgeData = {
  readonly id: string,
}
export class Pledge {

  @IsUUID('4')
  readonly id: string

  private constructor(id: string) {
    this.id = id
    const valid = this.validate()
    if (valid.length > 0) {
      throw new ValidationException(valid)
    }
  }

  /**
   * New up a non persisted Pledge
   */
  static newInstance() {
    return new Pledge(uuid())
  }

  static fromJSON(o: PledgeData) {
    return new Pledge(o.id)
  }

  validate(): ValidationError[] {
    return validateSync(this)
  }
}
