import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import { Pledge, PledgeData } from './Pledge'
import { PublicAggregatesView } from './PublicAggregatesView'
import { CloudFirestoreUserRepository } from './UserRepository'
import { ISO3166 } from './ISO3166'
import { User } from './User'

export async function computeTotalDistancePledged(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<void> {

  console.log('computeTotalDistancePledged function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('Pledge not found')
    return
  }

  const pledge = Pledge.fromJSON(data as PledgeData)

  const db = firebaseAdmin.firestore()
  const publicStatsRef = db.collection('publicStats')
    .doc('i-am-the-one-and-only') // Aint nobody I'd rather be

  const eventsRef = db.collection('firestoreEvents').doc(_event.eventId)

  return await db.runTransaction(async (tx) => {

    const statsDoc = await tx.get(publicStatsRef)
    const eventDoc = await tx.get(eventsRef)

    if (eventDoc.exists) {
      console.log('Firsetore event has already been processed, nothing to do')
      return
    }
    let aggregates: PublicAggregatesView = {
      countries: [],
      distanceKm: 0,
      distanceMiles: 0,
      participants: 0,
      distanceByCountry: {},
      participantsByCountry: {},
    }
    if (statsDoc.exists) {
      aggregates = await statsDoc.data() as PublicAggregatesView
    }

    const repo = new CloudFirestoreUserRepository(db)
    const user: User | undefined = await repo.find(pledge.userId)
    let country: string = ''
    if (user !== undefined && user.location !== undefined) {
      country = ISO3166.lookup(user.location.countryCode).name
    } else {
      console.log('no location information so returning')
      return
    }

    // Then we have not processed this event before.
    // We will record the fact that we processed this event for idempotency.
    await tx.create(eventsRef, { id: _event.eventId })

    // Update the aggregates.
    aggregates.distanceKm += pledge.distanceKm
    aggregates.distanceMiles += pledge.distanceMiles

    if (country !== '') {

      if (aggregates.countries.indexOf(country) === -1) {
        aggregates.countries.push(country)
      }

      if (!(country in aggregates.distanceByCountry)) {
        aggregates.distanceByCountry[country] = {
          distanceKm: pledge.distanceKm,
          distanceMiles: pledge.distanceMiles,
        }
      } else {
        aggregates.distanceByCountry[country].distanceKm += pledge.distanceKm
        aggregates.distanceByCountry[country].distanceKm += pledge.distanceMiles
      }
    }
    console.log('about to persist aggregates', aggregates)
    // Persist the aggregates.
    await tx.set(publicStatsRef, aggregates)
  })

}
