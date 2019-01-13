import { Pledge, PledgeData } from './Pledge'
import { Firestore, QueryDocumentSnapshot } from '@google-cloud/firestore'
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

  async findMostRecent(val: number): Promise<Pledge[]> {
    const query = this.col.orderBy('createdAt', 'desc').limit(val)
    const querySnap = await query.get()
    return querySnap.docs.map((qds: QueryDocumentSnapshot) => {
      return Pledge.fromJSON(fromFirestore(qds.data()) as PledgeData)
    })
  }
}
