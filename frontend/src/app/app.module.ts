import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AgmCoreModule } from '@agm/core'
import { AppComponent } from './app.component'
import { environment } from 'environments/environment'
import { LoginComponent } from './components/login/login.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PledgeFormComponent } from './components/pledge-form/pledge-form.component'

import { GlobeComponent } from './globe/globe.component'
import { ConfirmationComponent } from './components/confirmation/confirmation.component'
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component'
import { AppRoutingModule } from './/app-routing.module'
import { IndexComponent } from './pages/index/index.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PledgeFormComponent,
    GlobeComponent,
    ConfirmationComponent,
    PrivacyPolicyComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA1vhAqm-Z3kgx3HYwtbIRcwX4waVEU7eA',
      libraries: ['places'],
    }),
    AngularFireAuthModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
