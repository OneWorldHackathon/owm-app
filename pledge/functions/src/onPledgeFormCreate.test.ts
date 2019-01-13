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
import { CloudFirestorePledgeRepository } from './PledgeRepository'
import { Pledge } from './Pledge'
import { PledgeForm } from './PledgeForm'
import { createPledge } from './onPledgeFormCreate'

describe('Test onPledgeFormCreate', () => {

  it('test services are called', async () => {

    const stubEmailService =
      sinon.createStubInstance<EmailService>(SendGridEmailService)
    const stubUserRepo =
      sinon.createStubInstance<Repository<User>>(CloudFirestoreUserRepository)
    const stubPledgeRepo =
      sinon.createStubInstance<Repository<Pledge>>(CloudFirestorePledgeRepository)

    const user: User = User.newInstance('123-User', 'dev@oneworldhackathon.org', 'Dev User')
    stubUserRepo.find.returns(user)
    const pledgeForm: PledgeForm = {
      userId: '123-User',
      userDisplayName: 'Dev User',
      yearOfBirth: '1980',
      pledge: 500,
      location: { countryCode: 'GB', description: 'United Kingdom', lat: 58.4, lng: -2.8 },
    }
    await createPledge(pledgeForm, stubUserRepo, stubPledgeRepo, stubEmailService)
    expect(stubPledgeRepo.create.calledOnce).to.equal(true)
    expect(stubUserRepo.update.calledOnce).to.equal(true)
    expect(stubUserRepo.find.calledOnce).to.equal(true)

  })

})
