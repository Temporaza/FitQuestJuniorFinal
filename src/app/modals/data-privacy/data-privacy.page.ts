import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-data-privacy',
  templateUrl: './data-privacy.page.html',
  styleUrls: ['./data-privacy.page.scss'],
})
export class DataPrivacyPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
