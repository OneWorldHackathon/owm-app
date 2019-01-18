import { DocumentSnapshot, Firestore } from '@google-cloud/firestore'
import { EventContext } from 'firebase-functions'
import { PledgeForm } from './PledgeForm'
import { Pledge } from './Pledge'
import { Repository } from './Repository'
import { User } from './User'
import { CloudFirestoreUserRepository } from './UserRepository'
import { EmailService, SendGridEmailService } from './MailService'
import * as firebaseAdmin from 'firebase-admin'

export async function onPledgeFormCreate(
  _snap: DocumentSnapshot, _event: EventContext,
): Promise<boolean> {

  console.log('onPledgeFormCreate function fired')
  const data = _snap.data()
  if (data === undefined) {
    console.error('PledgeForm not found')
    return false
  }
  return await createPledge(_snap.id, data as PledgeForm,
                            new CloudFirestoreUserRepository(),
                            firebaseAdmin.firestore(), new SendGridEmailService)
}

export async function createPledge(id: string, pledgeForm: PledgeForm, userRepo: Repository<User>,
                                   db: Firestore,
                                   emailService: EmailService): Promise<boolean> {

  console.log('createPledge from PledgeForm', pledgeForm)
  // check we have this user account
  const user = await userRepo.find(pledgeForm.userId)
  if (user === undefined) {
    console.error('Cannot create a pledge for a User that does not exist', pledgeForm)
    return false
    const db = firebaseAdmin.firestore()
    await db.collection('pledgeForm').doc(id).delete()
  }
  user.displayName = pledgeForm.userDisplayName
  user.yearOfBirth = Number(pledgeForm.yearOfBirth)
  user.location = pledgeForm.location
  const pledge: Pledge = Pledge.newInstance(user.id(), pledgeForm.pledge,
                                            pledgeForm.location, pledgeForm.userDisplayName)

  console.log('new Pledge entity', pledge)
  try {
    const pledgeFormRef = db.collection('pledgeForm').doc(id)
    const pledgeRef = db.collection('pledge').doc()
    const userRef = db.collection('user').doc(user.id())

    // Save and Update in transaction
    await db.runTransaction<boolean>(async (t): Promise<boolean> => {
      const pf = pledgeFormRef.get()
      if (pf === undefined) {
        console.error('Pledge form mot found')
        return false
      }

      // TODO work on encapsulating this behaviour in the repositories
      const pledgeDoc = pledge.toFirestore()
      pledgeDoc.createdAt = new Date()
      pledgeDoc.updatedAt = new Date()

      const userDoc = user.toFirestore()
      userDoc.updatedAt = new Date()

      await t.create(pledgeRef, pledgeDoc)
      await t.set(userRef, userDoc)
      await t.update(pledgeFormRef, { response: 'OK' })

      return true
    })
  } catch (e) {
    console.log('Error creating new Pledge', e)
    pledgeForm.response = { error: { msg: 'Could not create pledge' } }
    return false
  }

  const emailVars = {
    displayName: user.displayName,
    pledge: Math.round(pledge.distanceMiles * 100) / 100 + ' miles' +
      ' (' + Math.round(pledge.distanceKm * 100) / 100 + ' K) ',
  }

  // send email
  try {
    await emailService.send('d-7c5e44dcbc4d4dbeb04ac25d8c6b15b0',
                            user.email, emailVars)
  } catch (e) {
    console.log('Email failed', e)
    return true
  }
  return true
}
