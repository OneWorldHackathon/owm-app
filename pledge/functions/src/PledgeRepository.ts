import { Pledge } from './Pledge'
import { Firestore } from '@google-cloud/firestore'
import { AbstractFirestoreRepository } from './Repository'

export class CloudFirestorePledgeRepository extends AbstractFirestoreRepository<Pledge> {
  constructor(_db?: Firestore, _colPrefix: string = '') {
    super('pledge', _db, _colPrefix)
  }
}