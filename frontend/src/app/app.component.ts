import { Component, OnInit, OnDestroy } from '@angular/core'
import { PledgeService } from '@shared/services/pledge.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app'

  public mostRecent10Pledges: string []
  public subscription: Subscription

  constructor(private pledgeService: PledgeService) {
  }

  ngOnInit(): void {
    this.pledgeService.getMostRecent10().subscribe(recent10 => {
      if (recent10 !== undefined) {
        this.mostRecent10Pledges = recent10.values
      }
    })
  }

  ngOnDestroy(): void {

  }
}
