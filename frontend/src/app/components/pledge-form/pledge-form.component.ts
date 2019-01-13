
import { MapsAPILoader } from '@agm/core'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService, ProviderProfile } from '@shared/services/auth.service'
import { take } from 'rxjs/operators'
import { PledgeService } from '@shared/services/pledge.service'

@Component({
  selector: 'app-pledge-form',
  templateUrl: './pledge-form.component.html',
})
export class PledgeFormComponent implements OnInit {

  public pledgeMetres: number = 100
  public pledgeForm: FormGroup | null = null
  @ViewChild('location')
  public locationSearch: ElementRef
  public profile: ProviderProfile
  public pledged: boolean = false

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private pledgeService: PledgeService,
              private mapsAPILoader: MapsAPILoader) { }

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getUser().pipe(take(1)).toPromise()
    if (user == null) {
      throw new Error('User must be signed in to access the pledge form')
    }
    this.pledged = await this.pledgeService.hasUserPledged()
    this.profile = user
    console.log(user)
    this.pledgeForm =  this.fb.group({
      name: [user.displayName, Validators.required],
      yearOfBirth: ['', [Validators.required, Validators.pattern('^(19[0-9][0-9]|200[0-5])$')]],
      pledge: [''],
      location: this.fb.group({
        countryCode: ['', Validators.required],
        description: ['', Validators.required],
        lat: ['', Validators.required],
        lng: ['', Validators.required],
      }),
    })
    await this.loadGooglePlacesAPI()
  }

  async loadGooglePlacesAPI(): Promise<void> {
    await this.mapsAPILoader.load()

    if (this.locationSearch && this.locationSearch.nativeElement) {
      const autocomplete = new google.maps.places.Autocomplete(this.locationSearch.nativeElement, {
        types: ['geocode'],
        fields: ['address_components', 'geometry'], // todo check data costs
      })
      autocomplete.addListener('place_changed', () => {
        const place: google.maps.places.PlaceResult = autocomplete.getPlace()
        console.log(place)
        if (place && this.pledgeForm != null) {
          if (place.address_components) {
            let locality =  place.address_components.find(address =>
                address.types.includes('locality'))
            if (locality == null) {
              locality =  place.address_components.find(address =>
                address.types.includes('postal_town'))
            }
            const country =  place.address_components.find(address =>
                  address.types.includes('country'))
            this.pledgeForm!.patchValue({location: {
              description: locality ? locality.long_name : 'Unknown',
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              countryCode: country ? country.short_name : 'Unkown',
            }})
            this.pledgeForm.get('location')!.markAsTouched()
          }
        }
        console.log(this.pledgeForm!.value)
      })
    }
  }

  async submitPledge(): Promise<void> {
    if (this.pledgeForm != null) {
      Object.keys(this.pledgeForm.controls).forEach(field => {
        const control = this.pledgeForm!.get(field)
        if (control) {
          control.markAsTouched({ onlySelf: true })
        }
      })
      console.log(this.pledgeForm.errors)
      console.log(this.pledgeForm)
      if (this.pledgeForm.valid) {
        const val = this.pledgeForm.getRawValue()
        console.log('r')
        await this.pledgeService.createPledge(val.name, val.yearOfBirth, val.pledge, val.location)
        this.pledged = true
      }
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut()
  }

  shouldShowErrors(fieldName: string): boolean {
    if (this.pledgeForm != null) {
      const field = this.pledgeForm.get(fieldName)
      if (field != null) {
        return field.invalid && field.touched
      }
    }
    return true
  }
}
