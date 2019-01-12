import { Pledge, PledgeData } from './Pledge'
import { Firestore } from '@google-cloud/firestore'
import { AbstractFirestoreRepository } from './Repository'
import { fromFirestore } from './utils'

export class CloudFirestorePledgeRepository extends AbstractFirestoreRepository<Pledge> {
  constructor(_db?: Firestore, _colPrefix: string = '') {
    super('pledge', _db, _colPrefix)
  }

  async find(id: string): Promise<Pledge | undefined> {
    const snap = await super.col.doc(id).get()
    const data = snap.data()
    if (data === undefined) {
      return undefined
    }
    return Pledge.fromJSON(fromFirestore(data) as PledgeData)
  }
}
