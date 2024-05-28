import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  ModalController,
  ToastController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

interface BMIRecord {
  date: string;
  bmi: number;
}

interface UserData {
  parentUID?: string;
  fullname?: string;
  email?: string;
  age?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  status?: string;
  usersUID?: string;
  bmiHistory?: BMIRecord[];
  // Add other properties as needed
}

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.page.html',
  styleUrls: ['./edit-user-modal.page.scss'],
})
export class EditUserModalPage implements OnInit {
  @Input() userData: UserData;
  userInputDate: string;
  unsavedChanges: boolean = false;
  isCloseButtonDisabled: boolean = true;
  manualBMIDeleted: boolean = false;
  today: string;
  minDate: string; // Declare the minDate property
  maxDate: string; // Declare the maxDate property

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private authService: AuthenticationForParentsService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.setTodayDate();
    this.initializeUserData();
    await this.getUserData();
    this.calculateBMI();
  }

  private initializeUserData() {
    this.userData = this.userData || {};
    this.userData.bmiHistory = this.userData.bmiHistory || [];
  }

  private setTodayDate() {
    const today = new Date();
    this.today = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const minDate = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );
    this.minDate = minDate.toISOString().split('T')[0]; // Setting minDate to one year ago

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.maxDate = tomorrow.toISOString().split('T')[0]; // Setting maxDate to tomorrow

    console.log("Today's date:", this.today); // Log today's date
    console.log('Min date:', this.minDate); // Log minimum date
    console.log('Max date:', this.maxDate); // Log maximum date
    this.userInputDate = this.today; // Set the default date to today
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }

  private async getUserData(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.log('Getting user data for usersUID:', this.userData.usersUID);

        const parentUID = await this.authService.getCurrentParentUID();
        const userDocRef = this.firestore
          .collection('parents')
          .doc(parentUID)
          .collection('users')
          .doc(this.userData.usersUID);

        const userDoc$ = userDocRef.snapshotChanges().pipe(
          map((snapshot) => {
            const data = snapshot.payload.data() as UserData;
            const exists = snapshot.payload.exists;
            return { data, exists };
          })
        );

        userDoc$.subscribe(({ data, exists }) => {
          console.log('UserDoc:', data);

          if (exists) {
            this.userData = data;
            this.userData.bmiHistory = this.userData.bmiHistory || [];
          }

          resolve(); // Resolve the promise after data is loaded
        });
      } catch (error) {
        console.error('Error retrieving user data:', error);
        reject(error); // Reject the promise in case of an error
      }
    });
  }

  async saveUser() {
    this.playButtonClickSound();
    let loading; // Declare loading variable here

    try {
      // Check if BMI history is empty
      if (!this.userData.bmiHistory || this.userData.bmiHistory.length === 0) {
        this.presentToast('Please add BMI history before saving user data.');
        return;
      }

      // Check if manual BMI was deleted without saving
      // if (this.manualBMIDeleted) {
      //   this.presentToast('Please save changes after deleting a manual BMI.');
      //   return;
      // }

      // Show loading indicator while saving
      loading = await this.loadingController.create({
        message: 'Saving user data...',
      });
      await loading.present();

      // Calculate BMI
      await this.calculateBMI();

      const parentUID = await this.authService.getCurrentParentUID();
      const usersCollectionRef = this.firestore
        .collection('parents')
        .doc(parentUID)
        .collection('users');

      // Update the document with the edited user data in the users subcollection
      await usersCollectionRef.doc(this.userData?.usersUID).update({
        ...this.userData,
      });

      // Also update the user document in the users collection
      const userCollectionRef = this.firestore.collection('users');
      await userCollectionRef.doc(this.userData?.usersUID).update({
        ...this.userData,
      });

      // Close the loading indicator
      await loading.dismiss();

      // Show success message
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'User data updated successfully.',
        buttons: ['OK'],
      });
      await alert.present();

      // Close the modal after saving changes
      this.modalController.dismiss();
    } catch (error) {
      console.error('Error updating user data:', error);
      // Close the loading indicator on error
      if (loading) {
        await loading.dismiss();
      }
      // Show error message
      const alert = await this.alertController.create({
        header: 'Error',
        message:
          'An error occurred while updating user data. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async addManualBMI() {
    this.playButtonClickSound();
    try {
      await this.calculateBMI();

      if (!this.userInputDate) {
        this.presentToast(
          'Please choose a date before adding a manual BMI record.'
        );
        return;
      }

      if (this.userInputDate) {
        const inputDate = new Date(this.userInputDate);
        if (!isNaN(inputDate.getTime())) {
          const formattedDate = this.userInputDate;

          this.userData.bmiHistory = this.userData.bmiHistory || [];

          const existingRecordIndex = this.userData.bmiHistory.findIndex(
            (record) => record.date === formattedDate
          );

          if (existingRecordIndex !== -1) {
            this.userData.bmiHistory[existingRecordIndex].bmi =
              this.userData.bmi;
          } else {
            this.userData.bmiHistory.push({
              date: formattedDate,
              bmi: this.userData.bmi,
            });
          }

          this.unsavedChanges = true;
          this.isCloseButtonDisabled = false;

          // Log the usersUID when adding a manual BMI record
          console.log('UsersUID:', this.userData.usersUID);

          this.userInputDate = '';
        } else {
          console.error('Invalid date format. Please enter a valid date.');
        }
      } else {
        console.error('User input date is required.');
      }
    } catch (error) {
      console.error('Error adding manual BMI record:', error);
    }
  }

  async confirmCloseModal() {
    this.playButtonClickSound();
    if (this.unsavedChanges) {
      const alert = await this.alertController.create({
        header: 'Unsaved Changes',
        message: 'You have unsaved changes. Saved it',
        buttons: [
          {
            text: 'Go Back',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
    } else {
      this.modalController.dismiss();
    }
  }

  async presentToast(
    message: string,
    color: string = 'success',
    duration: number = 3000
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      animated: true,
      position: 'bottom',
    });
    toast.present();
  }

  calculateBMI() {
    const { age, height, weight } = this.userData;

    if (age && height && weight) {
      const heightInMeters = height / 100;
      const weightInKilograms = weight;
      const bmi = weightInKilograms / (heightInMeters * heightInMeters);

      this.userData.bmi = Math.round(bmi * 100) / 100;

      if (bmi < 18.5) {
        this.userData.status = 'Underweight';
      } else if (bmi < 25) {
        this.userData.status = 'Healthy Weight';
      } else if (bmi < 30) {
        this.userData.status = 'Overweight';
      } else {
        this.userData.status = 'Obese';
      }
    }
  }

  handleInputChange() {
    this.calculateBMI();
    this.unsavedChanges = true;
    this.isCloseButtonDisabled = false; // Enable close button after input change
  }

  async closeModal() {
    this.playButtonClickSound();
    if (this.unsavedChanges) {
      await this.confirmCloseModal();
    } else {
      this.modalController.dismiss();
    }
  }

  async deleteBMIRecord(index: number) {
    this.playButtonClickSound();
    let loading;

    try {
      const alert = await this.alertController.create({
        header: 'Confirm Delete',
        message: 'Are you sure you want to delete this BMI record?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: async () => {
              // Show loading indicator while deleting
              loading = await this.loadingController.create({
                message: 'Deleting BMI record...',
              });
              await loading.present();

              // Remove the BMI record from the local array
              this.userData.bmiHistory.splice(index, 1);

              this.manualBMIDeleted = true;
              this.unsavedChanges = true;

              // Update the Firestore document without the deleted BMI record
              const parentUID = await this.authService.getCurrentParentUID();
              const userDocRef = this.firestore
                .collection('parents')
                .doc(parentUID)
                .collection('users')
                .doc(this.userData.usersUID);

              // Update the document with the edited user data in the users subcollection
              await userDocRef.update({
                bmiHistory: this.userData.bmiHistory,
              });

              console.log('BMI Record deleted successfully.');

              // Close the loading indicator
              await loading.dismiss();

              // this.presentToast(
              //   'BMI Record deleted successfully.',
              //   'success',
              //   3000
              // );
            },
          },
        ],
      });

      await alert.present();
    } catch (error) {
      console.error('Error deleting BMI record:', error);
      // Close the loading indicator on error
      if (loading) {
        await loading.dismiss();
      }
      this.presentToast(
        'Error deleting BMI record. Please try again.',
        'danger',
        3000
      );
      // Handle the error as needed
    }
  }
}
