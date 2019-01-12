import { User } from './User'
import { AbstractFirestoreRepository } from './Repository'
import { Firestore } from '@google-cloud/firestore'

export class CloudFirestoreUserRepository extends AbstractFirestoreRepository<User> {
  constructor(_db?: Firestore, _colPrefix: string = '') {
    super('user', _db, _colPrefix)
  }
}
