import * as admin from 'firebase-admin'
import { onPledgeFormCreate } from './onPledgeFormCreate'
import * as functions from 'firebase-functions'
import { onAuthUserCreate } from './onAuthUserCreate'
import { computeTotalDistancePledged } from './computeTotalDistancePledged'
import { computeTotalParticipants } from './computeTotalParticipants'
import { PledgeForm } from './PledgeForm'

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

  createPledge: functions.https.onRequest(async (request, response) => {
    if (request.ip === '127.0.0.1') {

      console.log('about to create test pledges')

      const pledgeForm: PledgeForm = {
        userId: 'rSwFFlafFrZj8StmDlRipURIn2R2',
        userDisplayName: 'Dev User',
        yearOfBirth: String(Math.floor(Math.random() * 2004) + 1900),
        pledge: Math.floor(Math.random() * 42164) + 500,
        location: { countryCode: 'GB', description: 'United Kingdom', lat: 54.05, lng: -2.8 },
      }
      admin.firestore().collection('pledgeForm').doc().create(pledgeForm)
      response.sendStatus(200)
    } else {
      response.status(403).send('Unauthorized')
    }
  }),

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
    .onCreate(computeTotalDistancePledged),
  onUserCreate: functions.firestore.document('users/{id}')
    .onCreate(computeTotalParticipants),
}
