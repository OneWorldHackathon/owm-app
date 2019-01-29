import * as admin from 'firebase-admin'
import { onPledgeFormCreate } from './onPledgeFormCreate'
import * as functions from 'firebase-functions'
import { onAuthUserCreate } from './onAuthUserCreate'
import { computeTotalDistancePledged } from './computeTotalDistancePledged'
import { computeTotalParticipants } from './computeTotalParticipants'
import { PledgeForm } from './PledgeForm'
import { collectRecentPledges } from './collectRecentPledges'

admin.initializeApp()
const settings = { timestampsInSnapshots: true }
admin.firestore().settings(settings)

exports.pledgeFunctions = {
  /**
   * Firestore Trigger reacting to onCreate document in pledgeForm collection
   * A valid plegdeForm is used to create a Pledge entity
   * Pledge Entity can only be written and read by server functions
   */
  onPledgeCreate: functions.firestore.document('pledgeForm/{id}')
    .onCreate(onPledgeFormCreate),

  /**
   * HTTP function that can run from localhost only (yarn serve)
   * Creates a Pledge for a known User
   */
  createPledge: functions.https.onRequest(async (request, response) => {
    if (request.ip === '127.0.0.1') {

      console.log('about to create test pledge')

      const pledgeForm: PledgeForm = {
        userId: 'iVcWdJLcKseshvufCafYlyZVY6v2',
        userDisplayName: 'Dev User',
        yearOfBirth: String(Math.floor(Math.random() * (2004 - 1900) + 1900)),
        pledge: Math.floor(Math.random() * 42164 - 500) + 500,
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

  /**
   * When Firebase Auth User is created, we react and create a new User entity
   * and persist in our database
   */
  onAuthUserCreate: functions.auth.user().onCreate(onAuthUserCreate),

}

/**
 * Aggregation / View functions for the headline stats
 *  - Total miles pledged
 *  - Countries pledged from
 *  - People
 */
exports.viewFunctions = {
  computeTotalDistancePledged: functions.firestore.document('pledge/{id}')
    .onCreate(computeTotalDistancePledged),

  collectRecentPledges: functions.firestore.document('pledge/{id}')
    .onCreate(collectRecentPledges),

  computeTotalParticipants: functions.firestore.document('user/{id}')
    .onWrite(computeTotalParticipants),
}
