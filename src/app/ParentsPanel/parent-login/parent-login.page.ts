import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';

@Component({
  selector: 'app-parent-login',
  templateUrl: './parent-login.page.html',
  styleUrls: ['./parent-login.page.scss'],
})
export class ParentLoginPage implements OnInit {
  logForm: FormGroup;
  errorMessage: string = '';
  notAuthorizedMessage: string = '';
  rememberMe: boolean = false;
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationForParentsService,
    public router: Router,
    public alertController: AlertController,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadRememberedEmail(); // Load remembered email when the component initializes
  }

  initForm() {
    this.logForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false], // Initialize rememberMe checkbox to false
    });
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }

  showErrorMessage() {
    this.errorMessage = 'Invalid Email or Password';
    setTimeout(() => {
      this.clearErrorMessage();
    }, 2000);
  }

  notAuthrorized() {
    this.notAuthorizedMessage = 'You are not authorized to access here!';
    setTimeout(() => {
      this.clearErrorMessage();
    }, 2000);
  }
  get errorControl() {
    return this.logForm?.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.logForm?.valid) {
      try {
        const email = this.logForm.value.email;
        const password = this.logForm.value.password;
        const rememberMe = this.logForm.value.rememberMe; // Get the value of rememberMe checkbox

        const userCredential = await this.authService.loginParent(
          email,
          password
        );

        if (rememberMe) {
          // If rememberMe is checked, save the email to localStorage
          localStorage.setItem('rememberedEmail', email);
        } else {
          // If rememberMe is not checked, remove the rememberedEmail from localStorage
          localStorage.removeItem('rememberedEmail');
        }

        const user = userCredential.user;

        const role = await this.authService.checkUserRole(user.uid);

        if (role === 'parent') {
          loading.dismiss();
          this.clearFormFields();
          this.navCtrl.navigateRoot(['/home-parent'], { replaceUrl: true });
          this.notAuthorized();
        }
      } catch (error) {
        console.log(error);
        loading.dismiss();
        this.showErrorMessage();
      }
    } else {
      loading.dismiss();
      this.presentAlert('Please fill in all required fields.');
    }
  }

  notAuthorized() {
    this.notAuthorizedMessage = 'You are not authorized to access here!';
    setTimeout(() => {
      this.clearErrorMessage();
    }, 2000);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  clearFormFields() {
    this.logForm.reset();
  }

  async loadRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.logForm.patchValue({ email: rememberedEmail }); // Patch the remembered email to the form
      this.logForm.patchValue({ rememberMe: true }); // Update rememberMe checkbox to true
    }
  }

  async signIn() {
    // This method is used to handle form submission when the "Remember Me" checkbox is toggled
    if (this.logForm.valid) {
      const email = this.logForm.value.email;
      const password = this.logForm.value.password;
      const rememberMe = this.logForm.value.rememberMe;

      try {
        await this.authService.loginParent(email, password);
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        this.router.navigate(['/home-parent']);
      } catch (error) {
        console.error('Error signing in:', error);
        this.errorMessage = 'Invalid email or password.';
      }
    } else {
      this.errorMessage = 'Please enter a valid email and password.';
    }
  }
}
