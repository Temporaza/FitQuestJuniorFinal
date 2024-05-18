import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-doctor-details-modal',
  templateUrl: './doctor-details-modal.page.html',
  styleUrls: ['./doctor-details-modal.page.scss'],
})
export class DoctorDetailsModalPage implements OnInit {

  @Input() doctorDetails: any;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

   // Helper function to format time
   formatTime(time: string | undefined): string {
    if (!time) {
      return 'N/A';
    }

    const formattedTime = new Date(`2000-01-01T${time}`);
    return formattedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

}
