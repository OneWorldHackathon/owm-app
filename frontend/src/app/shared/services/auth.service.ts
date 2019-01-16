import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { environment } from 'environments/environment'

export type ProviderProfile = {
  displayName: string | null,
  photoURL: string | null,
  email: string | null,
  userId: string,
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly ACTION_CODE_SETTINGS: auth.ActionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
    url: environment.signInWithEmail,
      // This must be true.
    handleCodeInApp: true,
    // dynamicLinkDomain: 'localhost:4200',
  }

  constructor(private auth: AngularFireAuth) { }

  async signInWithGoogle(): Promise<auth.UserCredential> {
    const provider = new auth.GoogleAuthProvider()
    return await this.signIn(provider)
  }

  async signInWithTwitter(): Promise<auth.UserCredential> {
    const provider = new auth.TwitterAuthProvider()
    return await this.signIn(provider)
  }

  async signInWithFacebook(): Promise<auth.UserCredential> {
    const provider = new auth.FacebookAuthProvider()
    return await this.signIn(provider)
  }

  async signIn(provider: firebase.auth.AuthProvider): Promise<auth.UserCredential> {
    return this.auth.auth.signInWithPopup(provider)
  }

  async signInWithEmail(email: string): Promise<void> {
    await this.auth.auth.sendSignInLinkToEmail(email, this.ACTION_CODE_SETTINGS)
    window.localStorage.setItem('emailForSignIn', email)
  }

  async checkSignInWithEmailLink(): Promise<auth.UserCredential | null> {
    try {
      if (this.auth.auth.isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn')
        if (!email) {
          email = window.prompt('Please provide your email for confirmation')
        }
        if (email) {
          return this.auth.auth.signInWithEmailLink(email, window.location.href)
        }
      }
    } catch (e) {
      console.error('Sign in with email link', e)
    }
    return null
  }

  async signOut(): Promise<void> {
    return await this.auth.auth.signOut()
  }

  getUser(): Observable<ProviderProfile | null> {
    return this.auth.authState.pipe(map(user => {
      if (user != null) {
        console.log('Got user', user)
        return {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          userId: user.uid,
        }
      }
      return null
    }))
  }

  async getUserId(): Promise<string | null> {
    return this.getUser().pipe(
      take(1),
      map(user => user ? user.userId : null),
    ).toPromise()
  }
}
