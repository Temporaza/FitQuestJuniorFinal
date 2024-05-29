import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';

interface ParentData {
  uid: string;
  fullname: string;
  email: string;
  // Add other fields as needed
}

@Component({
  selector: 'app-upgrade-version-modal',
  templateUrl: './upgrade-version-modal.page.html',
  styleUrls: ['./upgrade-version-modal.page.scss'],
})
export class UpgradeVersionModalPage implements OnInit {
  parentUid: string;
  parentName: string;
  parentEmail: string;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private authService: AuthenticationForParentsService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        this.parentUid = user.uid;

        // Fetch parent document from Firestore
        const parentDoc = await this.firestore
          .collection('parents')
          .doc<ParentData>(this.parentUid)
          .get()
          .toPromise();
        if (parentDoc.exists) {
          const parentData = parentDoc.data() as ParentData;
          this.parentName = parentData.fullname;
          this.parentEmail = parentData.email;

          // Log the parent UID, name, and email
          console.log('Parent UID:', this.parentUid);
          console.log('Parent Name:', this.parentName);
          console.log('Parent Email:', this.parentEmail);
        }
      }
    } catch (error) {
      console.error('Error fetching parent data:', error);
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  sendEmail() {
    const subject = 'Upgrade to Premium';
    const body = `Dear ${this.parentName},\n\nWe would like to inform you about our premium version, which provides access to additional features. To learn more and upgrade, please visit our website.\n\nBest regards,\nThe Team`;
    const recipientEmail = 'kobyraventemporaza@gmail.com';
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  }
}
