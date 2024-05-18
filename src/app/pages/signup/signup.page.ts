import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface ParentData {
  email: string;
  // Define other fields if needed
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm: FormGroup;
  parentUID: string;
  parentEmail: string;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.parentUID = user.uid; // Set parentUID when user is authenticated
        console.log('Parent UID:', this.parentUID);

        // Get parent's email from Firestore using parentUID
        const parentEmail = await this.getParentEmailByUID(user.uid);
        if (parentEmail) {
          // Set parent's email to the form control
          this.regForm.patchValue({
            parentEmail: parentEmail,
          });
        } else {
          console.log('Parent email not found');
        }
      } else {
        console.log('Parent UID not recognized');
      }
    });

    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+'),
          // Validators.email,
          // Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
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
      age: [''],
      birthday: [''],
      petName: [''],
    });
  }

  async getParentEmailByUID(parentUID: string): Promise<string | null> {
    try {
      const parentDoc = await this.firestore
        .collection('parents')
        .doc(parentUID)
        .get()
        .toPromise();
      if (parentDoc.exists) {
        const parentData = parentDoc.data() as ParentData;
        return parentData.email;
      } else {
        console.log('Parent document not found for UID:', parentUID);
        return null;
      }
    } catch (error) {
      console.error('Error fetching parent email:', error);
      return null;
    }
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm?.valid) {
      const parentEmail = this.regForm.value.parentEmail;
      const userEmail = `${this.regForm.value.email}@gmail.com`;
      const fullname = this.regForm.value.fullname;
      const password = this.regForm.value.password;

      // Retrieve age, birthday, and petName from the form
      const age = this.regForm.value.age;
      const birthday = this.regForm.value.birthday;
      const petName = this.regForm.value.petName;

      await this.authService
        .registerUser(
          userEmail,
          password,
          fullname,
          age,
          birthday,
          petName,
          parentEmail
        ) // Pass all required arguments
        .then(async (user) => {
          const parentUID = await this.getParentUIDByEmail(parentEmail);

          if (!parentUID) {
            loading.dismiss();
            console.log('Parent not found for email:', parentEmail);
            this.presentErrorAlert('Error', 'Parent Email does not exist.');
            return;
          }

          await this.saveUserToParent(parentUID, user);

          loading.dismiss();
          this.clearFormFields();
          this.presentRedirectAlert();
          // this.presentSuccessAlert('Success', 'Registration successful!');
        })
        .catch((error) => {
          console.log(error);
          loading.dismiss();
          this.presentErrorAlert(
            'Error',
            'An error occurred during registration. Please try again.'
          );
        });
    }
  }

  async presentRedirectAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message:
        'You will be redirected to the parent login page for verification.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/parent-login']);
          },
        },
      ],
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

  // Helper method to present error alert
  async presentErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Method to save user information to parent's UID
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

        // Create a reference to the parent document in the 'parents' collection
        const parentDocRef = this.firestore
          .collection('parents')
          .doc(parentUID);

        // Get the parent document data
        const parentDataSnapshot = await parentDocRef.get().toPromise();

        // Check if the parent document exists
        if (parentDataSnapshot.exists) {
          // Get the parent data
          const parentData = parentDataSnapshot.data();

          // Create a reference to the 'parents' subcollection under the user
          const userParentCollectionRef = this.firestore.collection(
            `users/${user.uid}/parents`
          );

          // Save the parent data to the 'parents' subcollection under the user
          await userParentCollectionRef.doc(parentUID).set(parentData);
        } else {
          console.error(
            'Error updating user document: Parent document does not exist'
          );
          // Handle the error appropriately
          throw new Error('Parent document does not exist');
        }
      } else {
        console.error(
          'Error updating parent document: User document does not exist'
        );
        // Handle the error appropriately
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error('Error updating documents:', error);
      throw error;
    }
  }

  clearFormFields() {
    this.regForm.reset();
  }

  navigateToVaccinationPage() {
    this.router.navigate(['/vaccination']); // Navigate to the vaccination page
  }
}
