import { Component, OnInit, Input } from '@angular/core'
import { ProviderProfile, AuthService } from '@shared/services/auth.service'
import { scrollToPledge } from '@shared/scrolltopledge'

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent implements OnInit {

  @Input('profile')
  public profile: ProviderProfile

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async signOut(): Promise<void> {
    scrollToPledge()
    await this.authService.signOut()
  }
}
