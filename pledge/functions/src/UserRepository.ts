import { User } from './User'
import { Firestore, CollectionReference, DocumentData } from '@google-cloud/firestore'
import * as firebaseAdmin from 'firebase-admin'

export interface UserRepository {
  find(id: string): Promise<User | undefined>
  create(user: User): Promise<User>
  update(user: User): Promise<User>

}

export class CloudFirestoreUserRepository implements UserRepository {

  private readonly _db: Firestore
  private readonly col: CollectionReference

  constructor(_db?: Firestore, _colPrefix: string = '') {
    this._db = _db !== undefined ? _db : firebaseAdmin.firestore()
    this.col = this._db.collection(_colPrefix + 'user')
  }
  find(_id: string): Promise<User | undefined> {
    throw new Error('Method not implemented.')
  }

  async create(user: User): Promise<User> {
    const doc: DocumentData = user.toFirestore()
    doc.createdAt = new Date()
    doc.updatedAt = new Date()
    await this.col.doc(user.id).create(doc)
    return user
  }

  async update(user: User): Promise<User> {
    const doc: DocumentData = user.toFirestore()
    doc.updatedAt = new Date()
    await this.col.doc(user.id).update(doc)
    return user
  }

}
