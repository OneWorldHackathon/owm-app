import { Injectable } from '@angular/core'
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'

export type DistanceByCountry = {
  readonly distanceKm: number,
  readonly distanceMiles: number,
}

export type PublicView = {
  readonly countries: string[],
  readonly distanceByCountry: { [key: string]: DistanceByCountry }
  readonly distanceKm: number,
  readonly distanceMiles: number,
  readonly particpants: number,
  readonly particpantsByCountry: { [key: string]: number },
}

export type PledgeForm = {
  readonly userId: string,
  readonly userDisplayName: string,
  readonly yearOfBirth: string,
  readonly pledge: number,
  readonly location: Location,
}

export type Location = {
  lat: number, lng: number, countryCode: string, description: string,
}

@Injectable({
  providedIn: 'root',
})
export class PledgeService {

  constructor(private db: AngularFirestore,
              private authService: AuthService) {}

  public getTotals(): Observable<PublicView | undefined> {
    return this.db.collection('publicView')
      .doc<PublicView>('top-level')
      .valueChanges()
  }

  public async createPledge(name: string, yearOfBirth: string,
                            pledge: number, location: Location): Promise<DocumentReference> {
    const userId = await this.authService.getUserId()
    if (userId == null) {
      throw new Error('User must be logged in to create a pledge')
    }
    return this.db.collection<PledgeForm>('pledgeForm')
      .add({
        yearOfBirth,
        pledge,
        location,
        userId,
        userDisplayName: name,
      })
  }
}
