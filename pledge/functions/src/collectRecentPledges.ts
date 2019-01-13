import { DocumentSnapshot } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import * as firebaseAdmin from 'firebase-admin'
import { CloudFirestorePledgeRepository } from './PledgeRepository'
import { Pledge } from './Pledge'

export type topPledges = {
  pledgeId: string,
  createdAt: string,

}
export async function collectRecentPledges(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<void> {

  console.log('collectRecentPledges function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('Pledge not found')
    return
  }
  const repo = new CloudFirestorePledgeRepository()
  const top10Pledges: Pledge[] = await repo.findMostRecent(10)
  const top1000Pledges: Pledge[] = await repo.findMostRecent(1000)
  const top10Values = top10Pledges.map((p) => {
    return p.userProfile.trim().split(' ')[0] + ' from ' + p.location.description + ' just pledged '
      + Math.round(p.distanceMiles * 100) / 100 + ' miles'
  })
  const arrays: number[][] = top1000Pledges.map((p) => {
    return [p.location.lat, p.location.lng, p.distanceKm / 160]
  })
  const top1000Values = ([] as number[]).concat(...arrays)

  const db = firebaseAdmin.firestore()
  await db.collection('publicView')
    .doc('most-recent-10-pledges').set({ values: top10Values })
  await db.collection('publicView')
    .doc('globe').set({ values: top1000Values })

}
