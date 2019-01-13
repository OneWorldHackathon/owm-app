import { expect } from 'chai'
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import 'mocha'
import { ISO3166 } from './ISO3166'

describe('Test ISO3166 lookup', () => {

  it('test lookup GB returns expected Country', () => {
    const data = ISO3166.lookup('GB')
    expect(data.alpha2).to.eq('GB')
    // second time should come from cache
    expect(data.alpha2).to.eq('GB')
  })

})
