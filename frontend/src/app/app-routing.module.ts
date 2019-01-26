import { NgModule }             from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PrivacyPolicyComponent } from '@pages/privacy-policy/privacy-policy.component'
import { IndexComponent } from '@pages/index/index.component'

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
