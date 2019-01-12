import * as admin from 'firebase-admin'
import { onPledgeFormCreate } from './onPledgeFormCreate'
import * as functions from 'firebase-functions'

admin.initializeApp()
const settings = { timestampsInSnapshots: true }
admin.firestore().settings(settings)

exports.pledgeFunctions = {
  /**
   * Firestore Trigger reacting to onCreate document in pledgeForm collection
   *
   * Real Pledge Entity can only be written to by server functions
   */
  onPledgeCreate: functions.firestore.document('pledgeForm/{id}')
    .onCreate(onPledgeFormCreate),

}
