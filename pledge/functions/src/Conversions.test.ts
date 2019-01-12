import { expect } from 'chai'
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
import {
  Conversions,
} from './Conversions'
describe('Test Conversions utility', () => {

  it('test metres to kilometres', async () => {
    const km = Conversions.metresToKilometres(1000)
    expect(km).to.be.eq(1)
  })
  it('test kilometres to metres', async () => {
    const m = Conversions.kilometresToMetres(1)
    expect(m).to.be.eq(1000)
  }),
  it('test metres to miles', async () => {
    const miles = Conversions.metresToMiles(42164.8128)
    expect(miles).to.be.eq(26.2)
  })
  it('test miles to metres', async () => {
    const metres = Conversions.milesToMetres(26.2)
    expect(metres).to.be.eq(42164.8128)
  })
})
