import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-congratulatory',
  templateUrl: './congratulatory.page.html',
  styleUrls: ['./congratulatory.page.scss'],
})
export class CongratulatoryPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }


  restartGame() {
    // Close the congratulatory modal
    this.modalController.dismiss();
    

    // Trigger an event or navigate to the parent page to restart the game
    // Add your logic to restart the game here
  }
}
