import { Injectable } from '@angular/core'
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { Observable, of } from 'rxjs'
import { AuthService } from './auth.service'
import { map, take, catchError } from 'rxjs/operators'

export type DistanceByCountry = {
  readonly distanceKm: number,
  readonly distanceMiles: number,
}

export type MostRecent10 = {
  values: string[],
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

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
  ) { }

  public getMostRecent10(): Observable<MostRecent10 | undefined> {
    return this.db.collection('publicView')
      .doc<MostRecent10>('most-recent-10-pledges')
      .valueChanges()
  }

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
    console.log('Creating pledge...')
    return this.db.collection<PledgeForm>('pledgeForm')
      .add({
        yearOfBirth,
        pledge,
        location,
        userId,
        userDisplayName: name,
      })
  }

  public getGlobeData(): Observable<number[] | undefined> {
    return this.db.collection('publicView')
      .doc<{ values: number[] }>('globe')
      .valueChanges().pipe(
        map((doc: { values: number[] }) => doc.values),
      )
  }

  public async hasUserPledged(): Promise<boolean> {
    const userId = await this.authService.getUserId()
    if (userId == null) {
      throw new Error('User must be logged in to check pledge status')
    }
    return this.db.collection('pledgeForm', ref =>
      ref.where('userId', '==', userId))
      .valueChanges()
      .pipe(
        take(1),
        map(form => (form && form.length > 0)),
        catchError(err => of(false)),
      )
      .toPromise()
  }

}
