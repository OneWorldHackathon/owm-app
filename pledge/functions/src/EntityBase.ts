import { FirestoreEntity } from './Repository'
import { validateSync, ValidationError, IsNotEmpty, IsString } from 'class-validator'

export abstract class EntityBase implements FirestoreEntity {

  @IsString()
  @IsNotEmpty()
  private readonly _id: string

  constructor(id: string) {
    this._id = id
  }

  id(): string {
    return this._id
  }

  validate(): ValidationError[] {
    return validateSync(this)
  }

  abstract toFirestore(): FirebaseFirestore.DocumentData

}
