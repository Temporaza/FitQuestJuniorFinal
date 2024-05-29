import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
