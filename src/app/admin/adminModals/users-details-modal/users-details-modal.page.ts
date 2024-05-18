import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface UserDetails {
  id: string;
  fullname: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  status: string;
  // Add other fields as needed
}



@Component({
  selector: 'app-users-details-modal',
  templateUrl: './users-details-modal.page.html',
  styleUrls: ['./users-details-modal.page.scss'],
})
export class UsersDetailsModalPage implements OnInit {

  @Input() userDetails: UserDetails;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
