import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationForParentsService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();

    // Retrieve email parameter from the URL
    const emailFromUrl = this.activatedRoute.snapshot.paramMap.get('email');

    // If email is available, pre-fill the email field in the form
    if (emailFromUrl) {
      this.forgotPasswordForm.patchValue({ email: emailFromUrl });
    }
  }

  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get errorControl() {
    return this.forgotPasswordForm.controls;
  }

  async sendResetLink() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      try {
        await this.authService.sendPasswordResetEmail(email);
        await this.presentResetSuccessAlert();
      } catch (error) {
        console.error('Error sending reset link:', error);
        this.errorMessage = 'Error sending reset link. Please try again later.';
      }
    } else {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }

  async presentResetSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Password Reset Email Sent',
      message:
        'Please check your email for instructions to reset your password.',
      buttons: ['OK'],
    });
    await alert.present();
    this.router.navigate(['/login']);
  }
}
