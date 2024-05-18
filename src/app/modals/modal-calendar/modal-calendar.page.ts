import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-calendar',
  templateUrl: './modal-calendar.page.html',
  styleUrls: ['./modal-calendar.page.scss'],
})
export class ModalCalendarPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
