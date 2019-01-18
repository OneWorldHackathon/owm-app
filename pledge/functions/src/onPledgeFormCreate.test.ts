import { expect } from 'chai'
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
import * as sinon from 'sinon'
import { EmailService, SendGridEmailService } from './MailService'
import { Repository } from './Repository'
import { CloudFirestoreUserRepository } from './UserRepository'
import { User } from './User'
import { PledgeForm } from './PledgeForm'
import { createPledge } from './onPledgeFormCreate'
const firebasemock = require('firebase-mock')

describe('Test onPledgeFormCreate', () => {

  it('test services are called', async () => {

    const stubEmailService =
      sinon.createStubInstance<EmailService>(SendGridEmailService)
    const stubUserRepo =
      sinon.createStubInstance<Repository<User>>(CloudFirestoreUserRepository)

    const mockfirestore = new firebasemock.MockFirestore()

    const user: User = User.newInstance('123-User', 'dev@oneworldhackathon.org', 'Dev User')
    stubUserRepo.find.returns(user)
    const pledgeForm: PledgeForm = {
      userId: '123-User',
      userDisplayName: 'Dev User',
      yearOfBirth: '1980',
      pledge: 500,
      location: { countryCode: 'GB', description: 'United Kingdom', lat: 58.4, lng: -2.8 },
    }
    await createPledge('pledge-form-id', pledgeForm, stubUserRepo, mockfirestore, stubEmailService)

    expect(stubUserRepo.find.calledOnce).to.equal(true)

  })

})
