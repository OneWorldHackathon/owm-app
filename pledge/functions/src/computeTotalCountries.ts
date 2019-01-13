import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import { PublicAggregatesView } from './PublicAggregatesView'
import { User } from './User'
import { ISO3166 } from './ISO3166'

export async function computeTotalCountries(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<void> {

  console.log('computeTotalCountries function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('User not found')
    return
  }

  const db = firebaseAdmin.firestore()
  const publicStatsRef = db.collection('publicStats')
    .doc('i-am-the-one-and-only') // Aint nobody I'd rather be

  const eventsRef = db.collection('firestoreEvents').doc(_event.eventId)

  const user = data as User

  if (user === undefined || user.location === undefined) {
    console.log('User is undefined or user.location is undefined, nothing to do')
    return

  }

  const location = user.location
  return await db.runTransaction(async (tx) => {
    let statsDoc = await tx.get(publicStatsRef)

    if (!statsDoc.exists) {
      // Then we are on first run, so let's create the one and only row.
      const defaultPublicStats: PublicAggregatesView = {
        countries: [],
        distanceKm: 0,
        distanceMiles: 0,
        participants: 0,
        distanceByCountry: {},
        participantsByCountry: {},
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
      const country = ISO3166.lookup(location.countryCode).name

      if (aggregates.countries.indexOf(country) === -1) {
        aggregates.countries.push(country)
      }

      // Persist the aggregates.
      await tx.update(publicStatsRef, aggregates)
    }

  })
}