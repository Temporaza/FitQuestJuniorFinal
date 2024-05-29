import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ParentDetailsModalPage } from '../adminModals/parent-details-modal/parent-details-modal.page';
import { ModalController } from '@ionic/angular';
import { UsersDetailsModalPage } from '../adminModals/users-details-modal/users-details-modal.page';
import {
  Chart,
  ChartConfiguration,
  ChartOptions,
  registerables,
} from 'chart.js';
import { AlertController } from '@ionic/angular';

// Register Chart.js components
Chart.register(...registerables);

interface Parent {
  id: string;
  fullname: string;
  gender: string;
  email: string;
  premium: boolean;
  // Add other fields as needed
}

interface ParentDetails {
  id: string;
  fullname: string;
  gender: string;
  users: any[];
  email: string;
  premium: boolean;
}

interface User {
  id: string;
  fullname: string;
  // Add other fields as needed
}

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
})
export class AdminHomePage implements OnInit {
  parents: any[] = [];
  users: any[] = [];
  showDetailsForParent: string | null = null;
  selectedParentDetails: any = null;
  showDetailsForUser: string | null = null;
  selectedUserDetails: any = null;
  showParentList: boolean = true; // Initially show the list
  showUserList: boolean = true; // Initially show the list

  @ViewChild('barCanvas') private barCanvas: ElementRef;

  barChart: Chart<'bar'>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Check authentication status when the page is loaded
    this.afAuth.authState.subscribe((user) => {
      if (!user) {
        // User is not authenticated, redirect to login page
        this.router.navigate(['/admin-panel']);
      } else {
        // User is authenticated, you can console log the user or perform other actions
        console.log('Current user email:', user.email);
      }
    });

    // Fetch the parent documents from the 'parents' collection
    this.firestore
      .collection('parents')
      .get()
      .subscribe((snapshot) => {
        this.parents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Parent),
        }));
        // Create the chart after parents data is loaded
        this.createBarChart();
      });

    // Fetch the user documents from the 'users' collection
    this.firestore
      .collection('users')
      .get()
      .subscribe((snapshot) => {
        this.users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as User),
        }));
      });
  }

  async toggleDetails(parentId: string) {
    // Log the parent's document UID
    console.log('Parent Document UID:', parentId);

    // Fetch details for the selected parent, including information from the 'users' subcollection
    const parentDetails = await this.fetchParentDetails(parentId);

    // Toggle details visibility for the selected parent
    this.showDetailsForParent =
      this.showDetailsForParent === parentId ? null : parentId;
    this.showDetailsForUser = null;
    // Set the details for the selected parent
    this.selectedParentDetails = parentDetails;
  }

  async toggleUserDetails(userId: string) {
    // Log the user's document UID
    console.log('User Document UID:', userId);

    // Fetch details for the selected user
    const userDetails = await this.fetchUserDetails(userId);

    // Toggle details visibility for the selected user
    this.showDetailsForUser =
      this.showDetailsForUser === userId ? null : userId;
    this.showDetailsForParent = null; // Close details for the parent if open
    // Set the details for the selected user
    this.selectedUserDetails = userDetails;
  }

  async fetchUserDetails(userId: string): Promise<User | null> {
    const userRef = this.firestore.collection('users').doc(userId);
    const userDoc = await userRef.get().toPromise();

    if (userDoc.exists) {
      return { id: userDoc.id, ...(userDoc.data() as User) };
    } else {
      return null;
    }
  }

  async fetchParentDetails(parentId: string): Promise<ParentDetails | null> {
    const parentRef = this.firestore.collection('parents').doc(parentId);
    const parentDoc = await parentRef.get().toPromise();

    if (parentDoc.exists) {
      const parentData = parentDoc.data() as Parent;

      // Fetch information from the 'users' subcollection
      const usersCollection = parentRef.collection('users');
      const usersSnapshot = await usersCollection.get().toPromise();
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      return {
        id: parentDoc.id,
        fullname: parentData.fullname,
        gender: parentData.gender,
        email: parentData.email,
        premium: parentData.premium,
        users: usersData,
      };
    } else {
      return null;
    }
  }

  async openDetailsModal(parentId: string) {
    const parentDetails = await this.fetchParentDetails(parentId);

    const modal = await this.modalController.create({
      component: ParentDetailsModalPage,
      componentProps: {
        parentDetails: parentDetails,
      },
    });

    await modal.present();
  }

  async openUserDetailsModal(userId: string) {
    // Fetch details for the selected user and open the details modal
    const userDetails = await this.fetchUserDetails(userId);

    const modal = await this.modalController.create({
      component: UsersDetailsModalPage,
      componentProps: {
        userDetails: userDetails,
      },
    });

    await modal.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing if the user cancels
          },
        },
        {
          text: 'Logout',
          handler: () => {
            this.afAuth
              .signOut()
              .then(() => {
                // Navigate to the login page or any other page after logout
                this.router.navigate(['/landing']);
              })
              .catch((error) => {
                console.error('Error during logout:', error);
              });
          },
        },
      ],
    });

    await alert.present();
  }

  toggleParentList() {
    this.showParentList = !this.showParentList;
  }

  toggleUserList() {
    this.showUserList = !this.showUserList;
  }

  createBarChart() {
    // Count the number of male and female parents
    const maleCount = this.parents.filter(
      (parent) => parent.gender === 'Male'
    ).length;
    const femaleCount = this.parents.filter(
      (parent) => parent.gender === 'Female'
    ).length;

    if (this.barCanvas && this.barCanvas.nativeElement) {
      const ctx = this.barCanvas.nativeElement.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Male', 'Female'],
          datasets: [
            {
              label: 'Number of Parents',
              data: [maleCount, femaleCount],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Gender',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Parents',
              },
            },
          },
        },
      });
    }
  }
}
