import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';
import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { VaccineDetailsModalPage } from 'src/app/modals/vaccine-details-modal/vaccine-details-modal.page';
import { EditUserModalPage } from 'src/app/modals/edit-user-modal/edit-user-modal.page';
import { AddusermodalPage } from 'src/app/modals/addusermodal/addusermodal.page';
import { ModalCalendarPage } from 'src/app/modals/modal-calendar/modal-calendar.page';
import { Subscription } from 'rxjs';
import { LoginPage } from 'src/app/pages/login/login.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Location } from '@angular/common';
import { ActivityLogModalPage } from 'src/app/modals/activity-log-modal/activity-log-modal.page';

interface ParentData {
  users?: string[];
  babies?: any[];
}

interface UserData {
  fullname?: string;
  email?: string;
  age?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  status?: string;
  usersUID?: string;
  lastLogin?: string;
  lastLogout?: string;
  duration?: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-vaccination',
  templateUrl: './vaccination.page.html',
  styleUrls: ['./vaccination.page.scss'],
})
export class VaccinationPage implements OnInit {
  parentUid: string;
  usersData: UserData[] = [];
  babies: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthenticationForParentsService,
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private location: Location,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.subscribeToUserLogin();
  }

  navigateToDashboard() {
    this.navCtrl.navigateForward('/home-parent', { animated: false });
    this.playButtonClickSound();
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }

  ngOnDestroy() {
    // Unsubscribe from all Firestore subscriptions
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  subscribeToUserLogin() {
    const subscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.parentUid = user.uid;
        this.loadData();
        this.loadBabies();
      } else {
        console.error('No user is logged in.');
        // Handle case where no user is logged in, such as redirecting to login page
      }
    });

    this.subscriptions.push(subscription);
  }
  async loadData() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        this.parentUid = user.uid;

        const subscription = this.firestore
          .collection('parents')
          .doc<ParentData>(this.parentUid)
          .snapshotChanges()
          .subscribe((parentDoc) => {
            const data = parentDoc.payload.data();
            this.babies = data?.babies || [];
            this.usersData = [];
            const usersUIDs: string[] = data?.users || [];

            usersUIDs.forEach((userUID) => {
              const userSubscription = this.firestore
                .collection('parents')
                .doc(this.parentUid)
                .collection('users')
                .doc<UserData>(userUID)
                .valueChanges()
                .subscribe((userData) => {
                  if (userData) {
                    const userWithUID: UserData = {
                      fullname: userData.fullname || 'N/A',
                      email: userData.email || 'N/A',
                      age: userData.age,
                      height: userData.height,
                      weight: userData.weight,
                      bmi: userData.bmi,
                      status: userData.status,
                      usersUID: userUID,
                    };
                    const existingIndex = this.usersData.findIndex(
                      (user) => user.usersUID === userWithUID.usersUID
                    );
                    if (existingIndex !== -1) {
                      // Update existing user
                      this.usersData[existingIndex] = userWithUID;
                    } else {
                      // Add new user
                      this.usersData.push(userWithUID);
                    }
                  }
                });

              // Add the user subscription to the subscriptions array
              this.subscriptions.push(userSubscription);
            });
          });

        // Add the parent subscription to the subscriptions array
        this.subscriptions.push(subscription);
      }
    } catch (error) {
      console.error('Error fetching parent document:', error);
    }
  }

  async openCalendarModal() {
    this.playButtonClickSound();
    const modal = await this.modalController.create({
      component: ModalCalendarPage,
    });

    await modal.present();
  }

  // navigateToSignup() {
  //   this.router.navigate(['/signup']);
  // }

  async editUser(userData: any) {
    this.playButtonClickSound();
    try {
      // Get the UID of the currently logged-in parent
      const parentUID = await this.authService.getCurrentParentUID();

      // Check if parentUID is available
      if (!parentUID) {
        console.error('Parent UID not available.');
        return;
      }

      // Log the parent UID
      console.log('Parent UID:', parentUID);

      // Find the user in usersData array based on fullname
      const userToEdit = this.usersData.find(
        (user) => user.fullname === userData.fullname
      );

      // Check if userToEdit is found
      if (userToEdit) {
        // Log the user UID
        console.log('User UID:', userToEdit.usersUID);

        const modal = await this.modalController.create({
          component: EditUserModalPage,
          componentProps: {
            userData: { ...userData },
          },
          backdropDismiss: false,
        });

        await modal.present();
      } else {
        console.error(
          'User not found in usersData array for fullname:',
          userData.fullname
        );
      }
    } catch (error) {
      console.error('Error getting parent UID:', error);
    }
  }

  async openAddUserModal() {
    this.playButtonClickSound();
    const modal = await this.modalController.create({
      component: AddusermodalPage, // Create a separate component for your modal
      componentProps: {
        // You can pass data if needed
      },
    });

    await modal.present();

    // Handle modal dismissal
    const { data } = await modal.onDidDismiss();
    if (data) {
      // Handle the data returned from the modal (if any)
      console.log('Modal closed with data:', data);
    }
  }

  async dismissModal() {
    await this.modalController.dismiss();
    this.playButtonClickSound();
  }

  async loadBabies() {
    try {
      const parentDoc = await this.firestore
        .collection('parents')
        .doc(this.parentUid)
        .get()
        .toPromise();

      if (parentDoc.exists) {
        const babiesCollection = parentDoc.ref.collection('babies');
        const babiesSnapshot = await babiesCollection.get();

        this.babies = babiesSnapshot.docs.map((doc) => doc.data());
      }
    } catch (error) {
      console.error('Error loading babies:', error);
    }
  }
  async openVaccineModal(baby: any) {
    const modal = await this.modalController.create({
      component: VaccineDetailsModalPage,
      componentProps: {
        baby: baby,
      },
    });

    await modal.present();
  }

  openSignupModal() {
    this.playButtonClickSound();
    if (this.usersData.length >= 1) {
      // If maximum users reached, display an alert
      this.presentMaxUsersAlert();
    } else {
      // If not reached, navigate to the signup page
      this.router.navigate(['/signup']);
    }
  }

  async presentMaxUsersAlert() {
    const alert = await this.alertController.create({
      header: 'Maximum Users Reached',
      message:
        'You have reached the maximum limit of users for the free version. Upgrade to our premium version for additional features.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // async logUserId(userId: string) {
  //   try {
  //     console.log('kid UID:', userId);
  //   } catch (error) {
  //     console.error('Error logging user ID:', error);
  //   }
  // }

  async openLoginPageModal(userId: string) {
    // Check if any of the relevant fields (age, height, weight, BMI, status) are empty
    this.playButtonClickSound();
    const userData = this.usersData.find((user) => user.usersUID === userId);
    if (
      userData &&
      (userData.age == null ||
        userData.height == null ||
        userData.weight == null ||
        userData.bmi == null ||
        userData.status == null)
    ) {
      // If any field is empty, show an alert to inform the user
      const alert = await this.alertController.create({
        header: 'Warning!',
        message: "Please input your kid's information first.",
        buttons: ['OK'],
        cssClass: 'warning-alert', // Apply warning color to the alert
      });
      await alert.present();
      return;
    }

    console.log('User ID:', userId);
    console.log('Parent UID:', this.parentUid);
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: {
        userId: userId,
        parentUid: this.parentUid,
      },
    });

    await modal.present();
  }

  async openVaccineDetailsModal(userData: UserData) {
    this.playButtonClickSound();
    const modal = await this.modalController.create({
      component: VaccineDetailsModalPage,
      componentProps: {
        userUID: userData.usersUID,
      },
    });

    await modal.present();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.location.forward();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Healthy Weight':
        return 'healthy-weight';
      case 'Underweight':
        return 'underweight';
      case 'Overweight':
        return 'overweight';
      case 'Obese':
        return 'obese';
      default:
        return ''; // Default class
    }
  }

  async openActivityLog(userData: UserData) {
    console.log('User ID:', userData);
    const modal = await this.modalController.create({
      component: ActivityLogModalPage,
      componentProps: { userData: { ...userData } },
    });
    return await modal.present();
  }
}
