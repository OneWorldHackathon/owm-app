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

  const VALID_DISTANCE_KM = 20

  it('test uuid must be a valid uuid', async () => {
    const pledge = Pledge.newInstance(VALID_DISTANCE_KM)
    expect(pledge.validate.length).to.be.eq(0)
  }),
  it('test distance is set properly', async () => {
    const pledge = Pledge.newInstance(VALID_DISTANCE_KM)
    expect(pledge.distanceMetres).to.be.eq(VALID_DISTANCE_KM)
  })

})
