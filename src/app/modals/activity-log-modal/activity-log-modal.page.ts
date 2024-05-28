import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

export interface ActivityLog {
  lastLogin?: string | firebase.firestore.Timestamp;
  lastLogout: string | firebase.firestore.Timestamp;
  duration: number;
}

@Component({
  selector: 'app-activity-log-modal',
  templateUrl: './activity-log-modal.page.html',
  styleUrls: ['./activity-log-modal.page.scss'],
})
export class ActivityLogModalPage implements OnInit {
  @Input() userData: any;
  @Input() userId: string;

  activityLogs: ActivityLog[] = [];
  lastLogin: Date | null = null;
  lastLogout: Date | null = null;
  duration: number | null = null;

  constructor(
    private modalController: ModalController,
    private authService: AuthenticationService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    if (this.userData && this.userData.usersUID) {
      this.userId = this.userData.usersUID;
      this.getUserActivity();
    }
  }

  close() {
    this.modalController.dismiss();
  }

  async getUserActivity() {
    try {
      // Fetch user data
      const userData: any = await this.authService.getUserDataByUid(
        this.userId
      );

      console.log('User Data:', userData);
      if (userData && userData.email) {
        console.log('User Email:', userData.email);
      } else {
        console.log('User data or email not found');
      }

      // Fetch activity logs from Firestore
      console.log(`Fetching activity logs for userId: ${this.userId}`);
      const logsSnapshot = await this.firestore
        .collection('users')
        .doc(this.userId)
        .collection('activityLogs', (ref) => ref.orderBy('lastLogout', 'desc'))
        .get()
        .toPromise();

      // console.log('Logs Snapshot:', logsSnapshot);

      this.activityLogs = logsSnapshot.docs.map((doc) => {
        const data = doc.data() as ActivityLog;
        // console.log('Log Data:', data);
        return data;
      });

      // console.log('Activity Logs:', this.activityLogs);

      if (this.activityLogs.length > 0) {
        const latestActivityLog = this.activityLogs[0];

        if (latestActivityLog) {
          if (latestActivityLog.lastLogout) {
            this.lastLogout =
              typeof latestActivityLog.lastLogout === 'string'
                ? new Date(latestActivityLog.lastLogout)
                : latestActivityLog.lastLogout.toDate();
            console.log('Last Logout:', this.lastLogout);
          } else {
            console.log('lastLogout field is missing or not a Timestamp');
          }

          if (latestActivityLog.duration !== undefined) {
            this.duration = latestActivityLog.duration;
            console.log('Duration:', this.duration);
          } else {
            console.log('duration field is missing');
          }
        } else {
          console.log('Latest activity log not found');
        }
      } else {
        console.log('No activity logs found');
      }

      if (userData && userData.lastLogin) {
        this.lastLogin = userData.lastLogin.toDate();
        console.log('Last Login:', this.lastLogin);
      } else {
        console.log('Last login not found');
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  }

  formatLogoutDate(logoutDate: string | firebase.firestore.Timestamp): string {
    if (typeof logoutDate === 'string') {
      return new Date(logoutDate).toLocaleString();
    } else if (logoutDate instanceof firebase.firestore.Timestamp) {
      return logoutDate.toDate().toLocaleString();
    } else {
      return '';
    }
  }
}
