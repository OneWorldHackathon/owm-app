import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { AuthService } from './auth.service'
import { take } from 'rxjs/operators'

export type Totals = {
  participants: number,
  participantsByCountry: any,
  countries: string[],
  distanceKm: number,
  distanceMiles: number,
  distanceByCountry: any,
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

  public getMostRecent10(): Observable<String[] | undefined> {
    return this.db.collection('publicView')
      .doc<String[]>('most-recent-10-pledges')
      .valueChanges()
  }

  public getTotals(): Observable<Totals | undefined> {
    return this.db.collection('publicView')
      .doc<Totals>('top-level')
      .valueChanges()
  }

  public async createPledge(name: string, yearOfBirth: string,
                            pledge: number, location: Location): Promise<DocumentReference> {
    const user = await this.authService.getUser().pipe(take(1)).toPromise()
    if (user == null) {
      throw new Error('User must be logged in to create a pledge')
    }
    return this.db.collection<PledgeForm>('pledgeForms')
      .add({
        yearOfBirth,
        pledge,
        location,
        userDisplayName: name,
        userId: user.userId,
      })
  }
}