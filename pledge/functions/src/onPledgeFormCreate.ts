import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import { PledgeForm } from './PledgeForm'
import { Pledge } from './Pledge'
import { UserRepository } from './UserRepository'

export async function onPledgeFormCreate(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<boolean> {

  console.log('onPledgeFormCreate function fired')

  return true
}

export async function createPledge(pledgeForm: PledgeForm, repo: UserRepository) {

  console.log('createPledge from PledgeForm', pledgeForm)
  // check we have this user account
  const user = await repo.find(pledgeForm.userId)
  if (user === undefined) {
    console.error('Cannot create a pledge for a User that does not exist', pledgeForm)
  }
  const pledge: Pledge = Pledge.newInstance()
  console.log(pledge)

}
