import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore'

export type Totals = {
  particpants: number,
  countries: number,
  milesPledged: number,
}

@Injectable({
  providedIn: 'root',
})
export class PledgeService {

  constructor(private db: AngularFirestore) {}

  public getTotals(): Observable<Totals | undefined> {
    return this.db.collection('totals')
      .doc<Totals>('aggregate')
      .valueChanges()
  }
}
