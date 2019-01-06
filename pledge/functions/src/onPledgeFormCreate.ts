import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'

export async function onPledgeFormCreate(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<boolean> {

  console.log('onPledgeFormCreate function fired')

  return true
}
