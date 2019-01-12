import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import { PledgeForm } from './PledgeForm'
import { Pledge } from './Pledge'
import { Repository } from './Repository'
import { CloudFirestorePledgeRepository } from './PledgeRepository'

export async function onPledgeFormCreate(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<boolean> {

  console.log('onPledgeFormCreate function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('PledgeForm not found')
    return false
  }
  return await createPledge(data as PledgeForm, new CloudFirestorePledgeRepository)
}

export async function createPledge(pledgeForm: PledgeForm,
                                   repo: Repository<Pledge>): Promise<boolean> {

  console.log('createPledge from PledgeForm', pledgeForm)
  // check we have this user account
  const user = await repo.find(pledgeForm.userId)
  if (user === undefined) {
    console.error('Cannot create a pledge for a User that does not exist', pledgeForm)
  }
  const pledge: Pledge = Pledge.newInstance(100)
  console.log(pledge)
  await repo.create(pledge)
  return true
}
