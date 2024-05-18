import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { ModalController, NavParams } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';

interface UserData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  alertController: any;
  userId: string = '';
  email: string = '';
  password: string = '';

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private afs: AngularFirestore,
    private navParams: NavParams
  ) {}

  clearErrorMessage() {
    this.errorMessage = '';
  }

  showErrorMessage() {
    this.errorMessage = 'Invalid Email or Password';
    setTimeout(() => {
      this.clearErrorMessage();
    }, 2000);
  }

  ngOnInit() {
    this.userId = this.navParams.get('userId');
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          // Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          // Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}")
        ],
      ],
    });

    if (this.userId) {
      this.getUserCredentials(this.userId);
    }
  }

  async getUserCredentials(userId: string) {
    try {
      const userDoc = await this.afs.collection('users').doc(userId).ref.get();
      if (userDoc.exists) {
        const userData = userDoc.data() as UserData; // Cast user data to UserData interface
        this.loginForm.patchValue({
          email: userData.email,
          password: userData.password,
        });
      } else {
        console.error('User document not found for userId:', userId);
      }
    } catch (error) {
      console.error('Error fetching user credentials:', error);
    }
  }

  get errorControl() {
    return this.loginForm?.controls;
  }

  async signIn() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.loginForm?.valid) {
      try {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;

        // Authenticate the user
        const userCredential = await this.authService.loginUser(
          email,
          password
        );

        // Access the User object from the UserCredential
        const user = userCredential.user;

        // Check the role of the authenticated user
        const userRole = await this.authService.checkUserRole(user.uid);

        // Check if the user has the required role (e.g., 'user')
        if (userRole === 'user') {
          loading.dismiss();
          this.clearFormFields();
          this.dismissModal();
          this.router.navigate(['/home']);
        } else {
          // If the user doesn't have the required role, display an error message
          loading.dismiss();
          this.showErrorMessage();
          this.authService.signOut(); // Sign out the user to prevent unauthorized access
          // Display a message indicating unauthorized access
          console.log(
            'Unauthorized access. You do not have the required role.'
          );
          this.presentErrorAlert(); // Display error alert
        }
      } catch (error) {
        console.log(error);
        loading.dismiss();
        this.showErrorMessage();
        this.presentErrorAlert(); // Display error alert
      }
    }
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Invalid email or password. Please try again.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  clearFormFields() {
    this.loginForm.reset();
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
