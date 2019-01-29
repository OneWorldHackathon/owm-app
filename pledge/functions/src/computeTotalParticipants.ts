import { DocumentSnapshot, DocumentData } from '@google-cloud/firestore'
import { EventContext, Change } from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import { PublicAggregatesView } from './PublicAggregatesView'
import { UserData, User } from './User'
import { ISO3166 } from './ISO3166'
import { CloudFirestoreUserRepository } from './UserRepository'

export async function computeTotalParticipants(
  change: Change<DocumentSnapshot>, _event: EventContext,
): Promise<void> {

  console.log('computeTotalParticipants function fired')

  const beforeData: DocumentData | undefined = change.before.data()
  const afterData: DocumentData | undefined = change.after.data()

  if (beforeData === undefined) {
    console.log('Before User data absent, nothing to do')
    return
  }
  if (afterData === undefined) {
    console.error('User data not found')
    return
  }

  const userBefore = beforeData as UserData
  const userAfter = afterData as UserData
  if (userBefore.location !== undefined || userAfter.location === undefined) {
    console.log('User has not just added location so nothing to do')
    return
  }

  const user: User | undefined = await new CloudFirestoreUserRepository().find(userAfter.id)

  if (user === undefined) {
    console.error('User not found in database')
  }
  const db = firebaseAdmin.firestore()
  const publicStatsRef = db.collection('publicView')
    .doc('top-level')

  const eventsRef = db.collection('firestoreEvent').doc(_event.eventId)
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

    let country: string = ''

    if (user === undefined || user.location === undefined) {
      console.error('User is missing the location')
      return
    }
    country = ISO3166.lookup(user.location.countryCode).name

    // We have not processed this event before.
    // We will record the fact that we processed this event for idempotency.
    await tx.create(eventsRef, { id: _event.eventId })

    // Update the aggregates.
    aggregates.participants = aggregates.participants + 1
    console.log('participant added to aggregates', aggregates)
    if (country !== '') {
      if (aggregates.countries.indexOf(country) === -1) {
        aggregates.countries.push(country)
      }

      if (!(country in aggregates.participantsByCountry)) {
        aggregates.participantsByCountry[country] = 1
      } else {
        aggregates.participantsByCountry[country] += 1
      }
    }
    console.log('about to persist aggregates', aggregates)
    // Persist the aggregates.
    await tx.set(publicStatsRef, aggregates)
  })

}
