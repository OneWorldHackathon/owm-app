import { Firestore, CollectionReference, DocumentData } from '@google-cloud/firestore'
import * as firebaseAdmin from 'firebase-admin'

export interface Repository<T> {
  find(id: string): Promise<T | undefined>
  create(entity: T): Promise<T>
  update(entity: T): Promise<T>
}

export interface FirestoreEntity {
  toFirestore(): DocumentData
  id(): string
}

export abstract class AbstractFirestoreRepository<T extends FirestoreEntity>
implements Repository<T> {

  private readonly _db: Firestore
  private readonly col: CollectionReference

  constructor(_entityName: string, _db?: Firestore, _colPrefix: string = '') {
    this._db = _db !== undefined ? _db : firebaseAdmin.firestore()
    this.col = this._db.collection(_colPrefix + _entityName)
  }

  find(_id: string): Promise<T | undefined> {
    throw new Error('Method not implemented.')
  }

  async create(entity: T): Promise<T> {
    const doc: DocumentData = entity.toFirestore()
    doc.createdAt = new Date()
    doc.updatedAt = new Date()
    await this.col.doc(entity.id()).create(doc)
    return entity
  }

  async update(entity: T): Promise<T> {
    const doc: DocumentData = entity.toFirestore()
    doc.updatedAt = new Date()
    await this.col.doc(entity.id()).update(doc)
    return entity
  }
}
