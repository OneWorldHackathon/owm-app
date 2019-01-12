import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import { PublicAggregatesView } from './PublicAggregatesView'
import { User } from './User'
import { ISO3166 } from './ISO3166'

export async function computeTotalParticipants(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<void> {

  console.log('computeTotalParticipants function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('User not found')
    return
  }

  const user: User = data as User

  const db = firebaseAdmin.firestore()
  const publicStatsRef = db.collection('publicStats')
                      .doc('i-am-the-one-and-only') // Aint nobody I'd rather be

  const eventsRef = db.collection('firestoreEvents').doc(_event.eventId)

  await db.runTransaction(async (tx) => {
    const statsDoc = await tx.get(publicStatsRef)

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
  })

  return await db.runTransaction(async (tx) => {

    const statsDoc = await tx.get(publicStatsRef)
    const eventDoc = await tx.get(eventsRef)

    if (!eventDoc.exists) {

      let country: string = ''
      if (user !== undefined && user.location !== undefined) {
        country = ISO3166.lookup(user.location.countryCode).name
      }

      // Then we have not processed this event before.
      // We will record the fact that we processed this event for idempotency.
      await tx.create(eventsRef, { id: _event.eventId })

      // Get the current state of the aggregates.
      const aggregates: PublicAggregatesView | undefined =
                await statsDoc.data() as PublicAggregatesView

      // Update the aggregates.
      aggregates.participants += 1

      if (country !== '') {
        if (aggregates.countries.indexOf(country) === -1) {
          aggregates.countries.push(country)
        }

        if (!(country in aggregates.participantsByCountry)) {
          aggregates.participantsByCountry[country] = 1
        } else {
          aggregates.participantsByCountry += 1
        }
      }

      // Persist the aggregates.
      await tx.update(publicStatsRef, aggregates)
    }

  })

}
