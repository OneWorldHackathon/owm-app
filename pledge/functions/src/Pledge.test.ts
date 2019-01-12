import { expect } from 'chai'
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
import {
  Pledge,
} from './Pledge'
describe('Test Pledge entity', () => {

  it('test uuid must be a valid uuid', async () => {
    const pledge = Pledge.newInstance()
    expect(pledge.validate.length).to.be.eq(0)
  })
})
