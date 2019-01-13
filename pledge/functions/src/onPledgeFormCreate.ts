import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import { PledgeForm } from './PledgeForm'
import { Pledge } from './Pledge'
import { Repository } from './Repository'
import { CloudFirestorePledgeRepository } from './PledgeRepository'
import { User } from './User'
import { CloudFirestoreUserRepository } from './UserRepository'

export async function onPledgeFormCreate(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<boolean> {

  console.log('onPledgeFormCreate function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('PledgeForm not found')
    return false
  }
  return await createPledge(data as PledgeForm,
                            new CloudFirestoreUserRepository(),
                            new CloudFirestorePledgeRepository())
}

export async function createPledge(pledgeForm: PledgeForm, userRepo: Repository<User>,
                                   repo: Repository<Pledge>): Promise<boolean> {

  console.log('createPledge from PledgeForm', pledgeForm)
  // check we have this user account
  const user = await userRepo.find(pledgeForm.userId)
  if (user === undefined) {
    console.error('Cannot create a pledge for a User that does not exist', pledgeForm)
    return false
  }
  user.displayName = pledgeForm.userDisplayName
  user.yearOfBirth = Number(pledgeForm.yearOfBirth)
  user.location = pledgeForm.location
  const pledge: Pledge = Pledge.newInstance(user.id(), pledgeForm.pledge, pledgeForm.location)
  console.log(pledge)
  await repo.create(pledge)
  await userRepo.update(user)
  return true
}
