import * as admin from 'firebase-admin'
import { User } from './User'
import { CloudFirestoreUserRepository } from './UserRepository'
import { Repository } from './Repository'
/**
 * Entry point for firebase auth hook when User first signs-up.
 * This function will be called from a Firebase function
 * and it's job is to create a local User document
 */
/**
 * Trigger A createUser when a new Firebase auth is created
 * @param userRecord
 */
export async function onAuthUserCreate(
  userRecord: admin.auth.UserRecord,
  // context: EventContext,
): Promise<User | undefined> {
  return createUser(
    userRecord, new CloudFirestoreUserRepository(),
  )
}

export async function createUser(
  userRecord: admin.auth.UserRecord, repo: Repository<User>,
): Promise<User | undefined> {
  console.log('userRecord', userRecord)
  console.log('onAuthUserCreate called for userId ', userRecord.uid)
  if (userRecord === undefined || !userRecord.email) {
    console.log(
      'UserRecord does not have an email address, probably an annon (guest) user',
    )
    return undefined
  }

  const displayName: string | null = userRecord.displayName
  const photoURL: string | null = userRecord.photoURL
  const user: User = User.newInstance(
    userRecord.uid, userRecord.email,
    displayName !== null ? displayName : 'Anonymous',
    photoURL !== null ? photoURL : undefined,
  )

  return repo.create(user)

}
