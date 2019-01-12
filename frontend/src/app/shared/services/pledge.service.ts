import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { AuthService } from './auth.service'
import { take } from 'rxjs/operators'

export type Totals = {
  particpants: number,
  countries: number,
  milesPledged: number,
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

  public getTotals(): Observable<Totals | undefined> {
    return this.db.collection('totals')
      .doc<Totals>('aggregate')
      .valueChanges()
  }

  public async createPledge(name: string, yearOfBirth: string,
                            pledge: number, location: Location): Promise<DocumentReference> {
    const user = await this.authService.getUser().pipe(take(1)).toPromise()
    if (user == null) {
      throw new Error('User must be logged in to create a pledge')
    }
    return this.db.collection<PledgeForm>('pledges')
      .add({
        yearOfBirth,
        pledge,
        location,
        userDisplayName: name,
        userId: user.userId,
      })
  }
}
