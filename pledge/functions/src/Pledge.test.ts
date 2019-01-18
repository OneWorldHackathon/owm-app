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
import { Location } from './PledgeForm'
describe('Test Pledge entity', () => {

  const VALID_DISTANCE_M = 2000
  const VALID_USER_ID = '123-User'
  const VALID_USER_PROFILE = 'Anon'
  const VALID_LOCATION: Location = { lat: 54, lng: -2.8, description: 'London', countryCode: 'GB' }
  it('test uuid must be a valid uuid', () => {
    const pledge = Pledge.newInstance(VALID_USER_ID, VALID_DISTANCE_M,
                                      VALID_LOCATION, VALID_USER_PROFILE)
    expect(pledge.validate.length).to.be.eq(0)
  })

  it('test undefined distance not allowed', () => {
    const pledge = Pledge.newInstance(VALID_USER_ID, VALID_DISTANCE_M,
                                      VALID_LOCATION, VALID_USER_PROFILE)
    const data: any = pledge.toPledgeData()
    data.distanceMetres = undefined
    expect(() => {
      Pledge.fromJSON(data)
    }).to.throw(ValidationException)
  })
  it('test distance is set properly', () => {
    const pledge = Pledge.newInstance(VALID_USER_ID, VALID_DISTANCE_M,
                                      VALID_LOCATION, VALID_USER_PROFILE)
    expect(pledge.distanceKm).to.be.eq(Conversions.metresToKilometres(VALID_DISTANCE_M))
  })
  it('test distance cannot exceed 26.2 miles', () => {
    expect(() => {
      Pledge.newInstance(VALID_USER_ID, Conversions.milesToMetres(26.3),
                         VALID_LOCATION, VALID_USER_PROFILE)
    }).to.throw(ValidationException)
  })
  it('test distance cannot be less than 100 metres', () => {
    expect(() => {
      Pledge.newInstance(VALID_USER_ID, 99,
                         VALID_LOCATION, VALID_USER_PROFILE)
    }).to.throw(ValidationException)
  })
  it('test distance can be exactly 100 metres', () => {
    expect(() => {
      Pledge.newInstance(VALID_USER_ID, 100,
                         VALID_LOCATION, VALID_USER_PROFILE)
    }).to.not.throw(ValidationException)
  })

})
