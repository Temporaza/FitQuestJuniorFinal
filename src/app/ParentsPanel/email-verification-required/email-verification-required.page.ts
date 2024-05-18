import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification-required',
  templateUrl: './email-verification-required.page.html',
  styleUrls: ['./email-verification-required.page.scss'],
})
export class EmailVerificationRequiredPage implements OnInit {
  userEmail: string;
  emailVerified: boolean = false;

  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userEmail = user.email;
        this.emailVerified = user.emailVerified;

        // Check if email is verified
        if (this.emailVerified) {
          console.log(
            'Email verification detected. Redirecting to home-parent page...'
          );
          this.navigateToHomeParent();
        } else {
          console.log('Email verification not yet detected.');
        }
      }
    });
  }

  navigateToHomeParent() {
    this.router.navigate(['/home-parent']);
  }
}
