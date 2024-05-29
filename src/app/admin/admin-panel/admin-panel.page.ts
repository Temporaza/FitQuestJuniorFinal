import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {
  username: string;
  password: string;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.username || !this.password) {
      // If either username or password is empty, show alert
      this.presentErrorAlert(
        'Login Failed',
        'Please provide both username and password.'
      );
      return;
    }

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        this.username,
        this.password
      );

      // Login successful, navigate to your admin page or perform other actions
      this.router.navigate(['/admin-home']);
    } catch (error) {
      // Handle login error (display a message, log, etc.)
      console.error('Login error:', error);
      // Check if error is due to invalid credentials
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        this.presentErrorAlert('Login Failed', 'Invalid username or password.');
      } else {
        // Handle other authentication errors
        this.presentErrorAlert(
          'Login Failed',
          'An unexpected error occurred. Please try again later.'
        );
      }
    }
  }

  async presentErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
