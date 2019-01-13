import { TestBed, inject } from '@angular/core/testing'

import { PledgeService } from './pledge.service'

describe('PledgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PledgeService],
    })
  })

  it('should be created', inject([PledgeService], (service: PledgeService) => {
    expect(service).toBeTruthy()
  }))
})
