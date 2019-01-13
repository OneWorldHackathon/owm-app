import { expect } from 'chai'
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
import { User } from './User'
import { ValidationException } from './ValidationException'

describe('Test User entity', () => {

  it('test photoURL is absent or valid URL', () => {

    const a = User.newInstance('123-User', 'dev@oneworlhackathon.org', 'Dev User')
    expect(a.profileURL).to.be.undefined
    expect(() => {
      User.newInstance('123-User', 'dev@oneworlhackathon.org', 'Dev User', 'InvalidUrl')
    }).to.throw(ValidationException)
  })
  it('test valid value in setDisplayName passes validation', () => {

    const a = User.newInstance('123-User', 'dev@oneworlhackathon.org', 'Dev User')
    a.displayName = 'Bob Smith'
    expect(a.displayName).to.eq('Bob Smith')
  })

  it('test toFirestore()', () => {
    const userRecord = {
      uid: 'oHFjfcMnYARyMasMGmhQaoRIjTu2',
      email: 'dev@oneworldhackathon.org',
      emailVerified: false,
      displayName: null,
      photoURL: null,
      phoneNumber: null,
      disabled: false,
    }

    const dn: string | null = userRecord.displayName
    const photoURL: string | null = userRecord.photoURL
    const user: User = User.newInstance(
      userRecord.uid, userRecord.email,
      dn !== null ? dn : 'Anonymous',
      photoURL !== null ? photoURL : undefined,
    )
    console.log(user.toFirestore())
  })
})
