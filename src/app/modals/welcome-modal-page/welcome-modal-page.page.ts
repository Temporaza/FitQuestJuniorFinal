import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-welcome-modal-page',
  templateUrl: './welcome-modal-page.page.html',
  styleUrls: ['./welcome-modal-page.page.scss'],
})
export class WelcomeModalPagePage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
