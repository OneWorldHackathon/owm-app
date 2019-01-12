import * as admin from 'firebase-admin'
import { onPledgeFormCreate } from './onPledgeFormCreate'
import * as functions from 'firebase-functions'
import { onAuthUserCreate } from './onAuthUserCreate'
import { computePledgeAggregates } from './computePledgeAggregates';

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

exports.userFunctions = {

  onAuthUserCreate: functions.auth.user().onCreate(onAuthUserCreate),

}

/**
 * Aggregation / View functions for the headline stats
 *  - Total miles pledged
 *  - Countries pledged from
 *  - People
 */
exports.viewFunctions = {
  onPledgeCreate: functions.firestore.document('pledge/{id}')
  .onCreate(computePledgeAggregates),
}
