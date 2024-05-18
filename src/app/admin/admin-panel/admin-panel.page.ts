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

  ngOnInit() {
  }

  async login() {
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
      this.presentErrorAlert('Login Failed', 'Invalid username or password.');
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
