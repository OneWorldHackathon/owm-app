import { expect } from 'chai'
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
import {
  Pledge,
} from './Pledge'
import {
  Conversions,
} from './Conversions'
import { ValidationException } from './ValidationException'
describe('Test Pledge entity', () => {

  const VALID_DISTANCE_M = 2000

  it('test uuid must be a valid uuid', () => {
    const pledge = Pledge.newInstance(VALID_DISTANCE_M)
    expect(pledge.validate.length).to.be.eq(0)
  })

  it('test undefined distance not allowed', () => {
    const pledge = Pledge.newInstance(VALID_DISTANCE_M)
    const data: any = pledge.toPledgeData()
    data.distanceMetres = undefined
    expect(() => {
      Pledge.fromJSON(data)
    }).to.throw(ValidationException)
  })
  it('test distance is set properly', () => {
    const pledge = Pledge.newInstance(VALID_DISTANCE_M)
    expect(pledge.distanceKm).to.be.eq(Conversions.metresToKilometres(VALID_DISTANCE_M))
  })
  it('test distance cannot exceed 26.2 miles', () => {
    expect(() => {
      Pledge.newInstance(Conversions.milesToMetres(26.3))
    }).to.throw(ValidationException)
  })
  it('test distance cannot be less than 100 metres', () => {
    expect(() => {
      Pledge.newInstance(99)
    }).to.throw(ValidationException)
  })
  it('test distance can be exactly 100 metres', () => {
    expect(() => {
      Pledge.newInstance(99)
    }).to.throw(ValidationException)
  })

})
