import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User } from 'firebase'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export type ProviderProfile = {
  displayName: string | null,
  photoURL: string | null,
  email: string | null,
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  async signInWithGoogle(): Promise<auth.UserCredential> {
    const provider = new auth.GoogleAuthProvider()
    return await this.signIn(provider)
  }

  async signIn(provider: firebase.auth.AuthProvider): Promise<auth.UserCredential> {
    return this.auth.auth.signInWithPopup(provider)
  }

  async signOut(): Promise<void> {
    return await this.auth.auth.signOut()
  }

  getUser(): Observable<ProviderProfile | null> {
    return this.auth.authState.pipe(map(user => {
      if (user != null) {
        return {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
        }
      }
      return null
    }))
  }
}
