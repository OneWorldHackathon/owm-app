import { v4 as uuid } from 'uuid'
import {
  IsUUID, ValidationError, validateSync, Min, Max,
} from 'class-validator'
import { ValidationException } from './ValidationException'
import { Conversions } from './Conversions'
import { FirestoreEntity } from './Repository';
import { toFirestore } from './utils';
import { DocumentData } from '@google-cloud/firestore';
/* Represents the persistence and transfer shape of a Pledge Entity */
export type PledgeData = {
  readonly id: string,
  readonly distanceMetres: number,
}
export class Pledge implements FirestoreEntity {

  @IsUUID('4')
  readonly _id: string

  @Min(500) @Max(42164.8128)
  private readonly _distanceMetres: number

  private constructor(_id: string, distanceMetres: number) {
    this._id = _id
    this._distanceMetres = distanceMetres
    const valid = this.validate()
    if (valid.length > 0) {
      throw new ValidationException(valid)
    }
  }

   /**
   * New up a non persisted Pledge
   */
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

  toPledgeData(): PledgeData {
    return {
      id: this._id,
      distanceMetres: this._distanceMetres,
    }
  }

  toFirestore(): DocumentData {
    return toFirestore(this.toPledgeData())
  }

  id(): string {
    return this._id
  }
}
