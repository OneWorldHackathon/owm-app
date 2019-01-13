import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { AuthService, ProviderProfile } from '@shared/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  public profile: ProviderProfile | null
  public emailSignInForm = this.fb.group({
    email: ['', Validators.email],
  })
  public signInWithEmailLinkSentTo: string | null = null

  constructor(private authService: AuthService,
              private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    await this.authService.checkSignInWithEmailLink()
    this.authService.getUser().subscribe(profile => {
      this.profile = profile
    })
  }

  async signInWithGoogle(): Promise<void> {
    const cred = await this.authService.signInWithGoogle()
    return this.signedIn(cred)
  }

  async signInWithTwitter(): Promise<void> {
    const cred = await this.authService.signInWithTwitter()
    return this.signedIn(cred)
  }

  async signInWithFacebook(): Promise<void> {
    const cred = await this.authService.signInWithFacebook()
    return this.signedIn(cred)
  }

  async signInWithEmail(): Promise<void> {
    const emailControl = this.emailSignInForm.get('email')
    if (this.emailSignInForm.valid && emailControl != null) {
      await this.authService.signInWithEmail(emailControl.value)
      this.signInWithEmailLinkSentTo = emailControl.value
    }
  }

  async signedIn(cred: firebase.auth.UserCredential): Promise<void> {
    if (cred.user != null) {
      const user = cred.user
      console.log('Sign in successful', cred)
      this.profile = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        userId: user.uid,
      }
    }
  }

  async signOut(): Promise<void> {
    this.authService.signOut()
  }
}
