import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface User {
  id: string;
  fullname: string;
  email: string;
  bmi: number;
  height: number;
  weight: number;
  age: number;
  status: string;
  // Add other fields if needed
}

interface ParentData {
  id: string;
  fullname: string;
  gender: string;
  email: string;
  premium: boolean;
  users: User[];
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
    if (!this.parentDetails || !this.parentDetails.id) {
      const toast = await this.toastController.create({
        message: 'Invalid parent details. Cannot update premium status.',
        duration: 2000,
      });
      toast.present();
      return;
    }

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
        message: `Error updating premium status. Please try again. ${error.message}`,
        duration: 2000,
      });
      toast.present();
    }
  }
}
