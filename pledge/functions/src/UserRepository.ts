import { User, UserData } from './User'
import { AbstractFirestoreRepository } from './Repository'
import { Firestore } from '@google-cloud/firestore'
import { fromFirestore } from './utils'

export class CloudFirestoreUserRepository extends AbstractFirestoreRepository<User> {
  constructor(_db?: Firestore, _colPrefix: string = '') {
    super('user', _db, _colPrefix)
  }

  async find(id: string): Promise<User | undefined> {
    const snap = await this.col.doc(id).get()
    const data = snap.data()
    if (data === undefined) {
      return undefined
    }
    return User.fromJSON(fromFirestore(data) as UserData)
  }

}
