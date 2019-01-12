import { Component, OnInit } from '@angular/core'
import { AuthService } from '@shared/services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app'

  public signedIn: boolean = false

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      if (user != null) {
        this.signedIn = true
      }
    })
  }
}
