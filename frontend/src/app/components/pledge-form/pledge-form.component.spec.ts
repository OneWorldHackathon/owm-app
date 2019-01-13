import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PledgeFormComponent } from './pledge-form.component'

describe('PledgeFormComponent', () => {
  let component: PledgeFormComponent
  let fixture: ComponentFixture<PledgeFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PledgeFormComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PledgeFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
