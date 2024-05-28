import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface ParentData {
  premium: boolean;
  // Add other fields if needed
}

@Component({
  selector: 'app-parent-details-modal',
  templateUrl: './parent-details-modal.page.html',
  styleUrls: ['./parent-details-modal.page.scss'],
})
export class ParentDetailsModalPage implements OnInit {
  @Input() parentDetails: any;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    console.log('Parent Details:', this.parentDetails);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async togglePremiumStatus() {
    try {
      const newPremiumStatus = !this.parentDetails.premium;
      const docRef = this.firestore
        .collection('parents')
        .doc(this.parentDetails.id);
      await docRef.update({ premium: newPremiumStatus });
      this.parentDetails.premium = newPremiumStatus;

      const toast = await this.toastController.create({
        message: `Premium status updated to ${
          newPremiumStatus ? 'Yes' : 'No'
        }.`,
        duration: 2000,
      });
      toast.present();
    } catch (error) {
      console.error('Error updating premium status:', error);

      const toast = await this.toastController.create({
        message: 'Error updating premium status. Please try again.',
        duration: 2000,
      });
      toast.present();
    }
  }
}
