import { Component, OnInit } from '@angular/core'
import { AuthService } from '@shared/services/auth.service'
import { PledgeService, PublicView } from '@shared/services/pledge.service'
import { differenceInDays } from 'date-fns'
import { from } from 'rxjs'
import { take, tap, flatMap } from 'rxjs/operators'
import { scrollToPledge } from '@shared/scrolltopledge'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app'

  public signedIn: boolean = false
  public totals: PublicView
  public mostRecent10Pledges: string[]
  public daysUntil

  constructor(private authService: AuthService, private pledgeService: PledgeService) {
  }

  ngOnInit(): void {
    const today = new Date()
    const april12 = new Date(2019, 4, 12, 0, 0)
    this.daysUntil = differenceInDays(april12, today)
    if (this.daysUntil < 0) {
      this.daysUntil = 0
    }
    from(this.authService.checkSignInWithEmailLink())
      .pipe(
        take(1),
        tap(cred => {
          if (cred) {
            scrollToPledge()
          }
        }),
        flatMap(() => this.authService.getUser()),
      ).subscribe(user => {
        this.signedIn = user != null
      })

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
  }
}
