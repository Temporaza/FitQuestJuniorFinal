import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  fullname: string = '';
  email: string = ''

  constructor(
    private authService: AuthenticationService,
    
  ) { }

  ngOnInit() {
    this.authService.getProfile().then((user) => {
      if (user) {
        this.authService.getUserDataByUid(user.uid).then((userData: any) => {
          if (userData) {
            this.fullname = userData.fullname;
            this.email = user.email; // Set the email
            console.log('Fullname retrieved:', this.fullname);
            console.log('Email retrieved:', this.email);
          } else {
            console.log('Fullname not found in user data:', userData);
          }
        }).catch((error) => {
          console.error('Error fetching user data:', error);
        });
      }
    }).catch((error) => {
      console.error('Error fetching user profile:', error);
    });
  }

}
