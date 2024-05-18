import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addusermodal',
  templateUrl: './addusermodal.page.html',
  styleUrls: ['./addusermodal.page.scss'],
})
export class AddusermodalPage implements OnInit {
  parentUid: string;
  parentEmail: string;
  regForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public loadingCtrl: LoadingController,
    private alertController: AlertController,
    public router: Router
  ) {}

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
        ],
      ],
      password: [
        '',
        [
          // Validators.required,
          // Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}")
        ],
      ],
      parentEmail: ['', [Validators.required, Validators.email]],
    });
  }

  // ngOnInit() {
  //   this.afAuth.authState.subscribe((user) => {
  //     if (user) {
  //       this.parentUid = user.uid;
  //       this.parentEmail = user.email;

  //       Load existing babies array
  //       this.loadBabies();
  //     }
  //   });
  // }

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm?.valid) {
      const parentEmail = this.regForm.value.parentEmail;

      // Check if the parent's email exists in the parents' collection
      const parentUID = await this.getParentUIDByEmail(parentEmail);

      if (!parentUID) {
        // Parent's email not found, display an error message
        loading.dismiss();
        console.log('Parent not found for email:', parentEmail);
        this.presentErrorAlert('Error', 'Parent Email does not exists.');
        // Add your logic to display an error message to the user, e.g., using a toast or an alert
        return;
      }

      const user = await this.authService
        .registerUser(
          this.regForm.value.email,
          this.regForm.value.password,
          this.regForm.value.fullname,
          this.regForm.value.age, // Add age parameter
          this.regForm.value.birthday, // Add birthday parameter
          this.regForm.value.petName, // Add petName parameter
          parentEmail
        )
        .catch((error) => {
          console.log(error);
          loading.dismiss();
        });

      if (user) {
        // Save the new user information to the parent's UID
        await this.saveUserToParent(parentUID, user);

        loading.dismiss();
        this.clearFormFields();

        // Display success message
        this.presentSuccessAlert('Success', 'Registration successful!');
      } else {
        console.log('Provide correct values');
      }
    }
  }

  // Helper method to present success alert
  async presentSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async getParentUIDByEmail(parentEmail: string): Promise<string | null> {
    try {
      // Call the method from AuthenticationService or wherever it's defined
      const parentUID = await this.authService.getParentUIDByEmail(parentEmail);
      return parentUID;
    } catch (error) {
      // Show error pop-up
      this.presentErrorAlert('Error', 'An error occurred. Please try again.');
      return null;
    }
  }

  async saveUserToParent(parentUID: string, user: any) {
    try {
      // Create a reference to the user document in the 'users' collection
      const userDocRef = this.firestore.collection('users').doc(user.uid);

      // Get the user document data
      const userDataSnapshot = await userDocRef.get().toPromise();

      // Check if the user document exists
      if (userDataSnapshot.exists) {
        // Get the user data
        const userData = userDataSnapshot.data();

        // Create a reference to the 'users' subcollection under the parent
        const parentUserCollectionRef = this.firestore.collection(
          `parents/${parentUID}/users`
        );

        // Save the user data to the 'users' subcollection under the parent
        await parentUserCollectionRef.doc(user.uid).set(userData);
      } else {
        console.error(
          'Error updating parent document: User document does not exist'
        );
        // Handle the error appropriately
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error('Error updating parent document:', error);
      throw error;
    }
  }

  clearFormFields() {
    this.regForm.reset(); // Reset the form to its initial state
  }

  async presentErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
