import { Component, OnInit } from '@angular/core'
import { AuthService } from '@shared/services/auth.service'
import { PledgeService, PublicView } from '@shared/services/pledge.service'
import { differenceInDays } from 'date-fns'
import { from } from 'rxjs'
import { take, tap, flatMap } from 'rxjs/operators'
import { scrollToPledge } from '@shared/scrolltopledge'
import * as $ from 'jquery'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

  public signedIn: boolean = false
  public totals: PublicView
  public daysUntil: number

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

    // todo some jquery,
    // this function will be triggered when the index component gets initialised

    initTicker();
  }
}
