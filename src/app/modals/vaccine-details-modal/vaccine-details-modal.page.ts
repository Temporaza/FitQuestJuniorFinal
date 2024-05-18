import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import {
  AlertController,
  ModalController,
  NavController,
  NavParams,
} from '@ionic/angular';

@Component({
  selector: 'app-vaccine-details-modal',
  templateUrl: './vaccine-details-modal.page.html',
  styleUrls: ['./vaccine-details-modal.page.scss'],
})
export class VaccineDetailsModalPage {
  userUID: string;
  vaccines: any = {};
  constructor(
    private modalController: ModalController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private alertController: AlertController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.userUID = this.navParams.get('userUID');
    console.log('User UID:', this.userUID);

    this.retrieveCheckedVaccines();
  }

  retrieveCheckedVaccines() {
    this.firestore
      .doc(`users/${this.userUID}`)
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          const userData: any = doc.data();
          if (userData && userData.vaccines) {
            this.vaccines = userData.vaccines;
          }
        }
      });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  openVaccineDetailsModal(vaccineName: string) {
    let details = '';
    switch (vaccineName) {
      case 'BCG':
        details =
          'Provides some protection against severe forms of pediatric non-pulmonary TB such as TB Meningitis.';
        break;
      case 'Hepatitis B':
        details = 'Prevention of hepatitis B.';
        break;
      case 'DPT/TdaP/Td':
        details = 'Prevention of diphtheria, pertussis, at tetanus.';
        break;
      case 'IPV':
        details = 'Prevention of infection from polio virus.';
        break;
      case 'HiB':
        details =
          'Prevention of serious diseases caused by Haemophilus influenzae, such as pneumonia, meningitis, and sepsis.';
        break;
      case 'PCV':
        details =
          'Prevention of pneumococcal diseases such as pneumonia, meningitis, sepsis, otitis media, and sinusitis.';
        break;
      case 'Measles/MMR':
        details = 'Prevention of measles, mumps, and rubella';
        break;
      case 'Varicella':
        details = 'Prevention of chickenpox or varicella';
        break;
      default:
        details = 'No details available.';
        break;
    }

    this.vaccines[vaccineName] = true;

    const contentElement = document.getElementById('vaccineDetailsContent');
    if (contentElement) {
      contentElement.innerHTML = details;
    }
  }

  saveVaccines() {
    // Save the checked vaccines to Firestore under the user's document
    this.firestore
      .collection('users')
      .doc(this.userUID)
      .update({
        vaccines: this.vaccines,
      })
      .then(() => {
        this.presentSuccessAlert();
      })
      .catch((error) => {
        console.error('Error saving vaccines:', error);
      });
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Vaccines saved successfully.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
