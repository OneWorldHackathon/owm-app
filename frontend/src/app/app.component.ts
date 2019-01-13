import { Component, OnInit } from '@angular/core'
import { AuthService } from '@shared/services/auth.service'
import { PledgeService, Totals } from '@shared/services/pledge.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app'

  public signedIn: boolean = false
  public totals: Totals
  public mostRecent10Pledges: String[]

  constructor(private authService: AuthService, private pledgeService: PledgeService) {
  }

  ngOnInit(): void {
    this.pledgeService.getTotals().subscribe(totals => {
      if (totals !== undefined) {
        this.totals = totals
      }
    })
    this.pledgeService.getMostRecent10().subscribe(recent10 => {
      if (recent10 !== undefined) {
        this.mostRecent10Pledges = recent10.values
      }
    })
    this.authService.getUser().subscribe(user => {
      if (user != null) {
        this.signedIn = true
      }
    })
  }
}
