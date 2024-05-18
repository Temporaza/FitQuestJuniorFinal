import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-parent-details-modal',
  templateUrl: './parent-details-modal.page.html',
  styleUrls: ['./parent-details-modal.page.scss'],
})
export class ParentDetailsModalPage implements OnInit {

  @Input() parentDetails: any;


  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
