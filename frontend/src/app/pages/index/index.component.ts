import { Component, OnInit, AfterViewChecked } from '@angular/core'
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
export class IndexComponent implements OnInit, AfterViewChecked {

  public signedIn: boolean = false
  public totals: PublicView
  public daysUntil: number
  public tickerInitd: boolean = false
  public initTicker: boolean = false

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
      console.log('BOUT OT TIN', window && !this.tickerInitd)
      if (window && !this.tickerInitd) {
        this.initTicker = true
      }
    })
  }

  ngAfterViewChecked(): void {
    if (this.initTicker && !this.tickerInitd) {
      window['initTicker']()
      this.tickerInitd = true
    }
  }
}
