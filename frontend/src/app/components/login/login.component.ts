import { Component, OnInit } from '@angular/core'
import { AuthService, ProviderProfile } from '@shared/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  public profile: ProviderProfile | null

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(profile => {
      this.profile = profile
    })
  }

  async signInWithGoogle(): Promise<void> {
    const cred = await this.authService.signInWithGoogle()
    if (cred.user != null) {
      console.log('Sign in successful', cred)
      return this.signedIn(cred.user)
    }
    console.error('Sign in unsuccessful', cred)
  }

  async signedIn(user: firebase.User): Promise<void> {
    this.profile = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      userId: user.uid,
    }
  }

  async signOut(): Promise<void> {
    this.authService.signOut()
  }
}
