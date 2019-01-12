import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import { Pledge } from './Pledge'
import { PublicAggregatesView } from './PublicAggregatesView'

export async function computeTotalDistancePledged(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<void> {

  console.log('computeTotalDistancePledged function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('Pledge not found')
    return
  }

  const pledge = data as Pledge

  const db = firebaseAdmin.firestore()
  const publicStatsRef = db.collection('publicStats')
                      .doc('i-am-the-one-and-only') // Aint nobody I'd rather be

  const eventsRef = db.collection('firestoreEvents').doc(_event.eventId)

  return await db.runTransaction(async (tx) => {
    let statsDoc = await tx.get(publicStatsRef)

    if (!statsDoc.exists) {
      // Then we are on first run, so let's create the one and only row.
      const defaultPublicStats: PublicAggregatesView = {
        countries: [],
        distanceKm: 0,
        distanceMiles: 0,
        participants: 0,
      }
      await tx.create(publicStatsRef, defaultPublicStats)
    }

    statsDoc = await tx.get(publicStatsRef)

    const eventDoc = await tx.get(eventsRef)

    if (!eventDoc.exists) {
      // Then we have not processed this event before.
      // We will record the fact that we processed this event for idempotency.
      await tx.create(eventsRef, { id: _event.eventId })

      // Get the current state of the aggregates.
      const aggregates: PublicAggregatesView | undefined =
                await statsDoc.data() as PublicAggregatesView

      // Update the aggregates.
      aggregates.distanceKm += pledge.distanceKm
      aggregates.distanceMiles += pledge.distanceMiles

      // Persist the aggregates.
      await tx.update(publicStatsRef, aggregates)
    }

  })

}
