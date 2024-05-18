import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { ModalController } from '@ionic/angular';
import { WelcomeModalPagePage } from 'src/app/modals/welcome-modal-page/welcome-modal-page.page';


declare var interact: any;

@Component({
  selector: 'app-trash-game',
  templateUrl: './trash-game.page.html',
  styleUrls: ['./trash-game.page.scss'],
})
export class TrashGamePage implements OnInit {

  gameFinished = false;
  allowDragging = true;

  imageInCorrectBin = false;
  bottleInCorrectBin = false;
  bananaInCorrectBin = false;
  appleInCorrectBin = false;
  paintInCorrectBin = false;
  sprayInCorrectBin = false;
  

  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController
    ) { }



  async ngOnInit() {

     // Retrieve the current user's information
     const currentUser = this.authService.getCurrentUser();

     // Check if the user is authenticated
     if (currentUser) {
       // Log the user ID to the console
       console.log('User ID:', (await currentUser).uid);
     } else {
       // Handle the case when the user is not authenticated
       console.error('User not authenticated.');
     }

    const modal = await this.modalController.create({
      component: WelcomeModalPagePage,
    });
  
    return await modal.present();
    
   }

   ngAfterViewInit() {
    const onDropFunction = (event) => {
      const relatedTarget = event.relatedTarget;
    
      if (event.target.id === 'recycleImage' && relatedTarget.id === 'draggableImage') {
        console.log('Paper is in the recycle bin now!');
        this.presentCorrectBinAlert();
        relatedTarget.classList.add('dropped');
        this.imageInCorrectBin = true;
      } else if (event.target.id === 'recycleImage' && relatedTarget.id === 'draggableBottle') {
        console.log('Bottle is in the recycle bin now!');
        this.presentCorrectBinAlert();
        relatedTarget.classList.add('dropped');
        this.bottleInCorrectBin = true;
      } else if (event.target.id === 'wasteImage' && relatedTarget.id === 'draggableBanana') {
        console.log('Banana is in the waste bin now!');
        this.presentCorrectBinAlert();
        relatedTarget.classList.add('dropped');
        this.bananaInCorrectBin = true;
      } else if (event.target.id === 'wasteImage' && relatedTarget.id === 'draggableApple') {
        console.log('Apple is in the waste bin now!');
        this.presentCorrectBinAlert();
        relatedTarget.classList.add('dropped');
        this.appleInCorrectBin = true;
      } else if (event.target.id === 'hazardImage' && relatedTarget.id === 'draggablePaint') {
        console.log('Paint is in the hazard bin now!');
        this.presentCorrectBinAlert();
        relatedTarget.classList.add('dropped');
        this.paintInCorrectBin = true;
      } else if (event.target.id === 'hazardImage' && relatedTarget.id === 'draggableSpray') {
        console.log('Spray is in the hazard bin now!');
        this.presentCorrectBinAlert();
        relatedTarget.classList.add('dropped');
        this.sprayInCorrectBin = true;
      } else {
        console.log('Item should not be here!');
        this.presentWrongBinAlert();
        relatedTarget.style.transform = 'translate(50%, 50%)'; // Reset the transform when dropped on the wrong bin
        relatedTarget.setAttribute('data-x', 0); // Reset the x position
        relatedTarget.setAttribute('data-y', 0); // Reset the y position
      }
    
      // Disable draggable behavior if the item is dropped into the correct bin
      if (this.imageInCorrectBin && this.bottleInCorrectBin && this.bananaInCorrectBin &&
        this.appleInCorrectBin && this.paintInCorrectBin && this.sprayInCorrectBin) {
      // Call the method to present the game completion alert
      this.presentGameFinishedAlert();
    }
    };
    
    interact('.dropzone').dropzone({
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,
  
      // Listen for drop related events
      ondropactivate: function (event) {
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;
  
        // Feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
      },
      ondragleave: function (event) {
        // Remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
      },
      ondrop: onDropFunction,
      ondropdeactivate: function (event) {
        // Remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });
    
    interact('.draggable')
    .draggable({
      inertia: {
        resistance: 5,
        minSpeed: 60,
        speed: 40,
        endSpeed: 3,
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        })
      ],
      autoScroll: true,
      onmove: this.dragMoveListener,
    });
  }
    private dragMoveListener (event) {
      var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
  }

  private async presentWrongBinAlert() {
    const alert = await this.alertController.create({
      header: 'Wrong Bin!',
      message: 'You dropped the item in the wrong bin.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  private async presentCorrectBinAlert() {
    const alert = await this.alertController.create({
      header: 'Correct Bin!',
      message: 'You dropped the item in the correct bin.',
      buttons: ['OK'],
    });
  
    await alert.present();
  }

  private async presentGameFinishedAlert() {
    console.log('Checking game completion...');
  
    // Check if all images are in their correct bins
    if (
      this.imageInCorrectBin &&
      this.bottleInCorrectBin &&
      this.bananaInCorrectBin &&
      this.appleInCorrectBin &&
      this.paintInCorrectBin &&
      this.sprayInCorrectBin
    ) {
      console.log('Game completed!');
  
      const alert = await this.alertController.create({
        header: 'Congratulations!',
        message: 'You have finished the game and earned certain points!',
        buttons: [{
          text: 'Play Again',
          handler: () => {
            console.log('Play Again clicked!');
            // Code to reset the game
          this.resetGame();
          
          // Additional code to start a new game, if needed
          // For example, you might want to display a welcome modal again
          this.presentWelcomeModal();
          }
        }]
      });
  
      await alert.present();
    }
  }

  private async resetGame() {
    console.log('Resetting the game...');

    // Display a loading spinner
    const loading = await this.loadingController.create({
      message: 'Resetting game...',
    });
    await loading.present();

    // Reset all flags to false
    this.imageInCorrectBin = false;
    this.bottleInCorrectBin = false;
    this.bananaInCorrectBin = false;
    this.appleInCorrectBin = false;
    this.paintInCorrectBin = false;
    this.sprayInCorrectBin = false;

    // Enable draggable behavior for all items
    interact('.draggable').draggable(true);

    // Reset the positions of draggable items
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach((draggableElement: any) => {
        (draggableElement as HTMLElement).style.transform = 'translate(0px, 0px)';
        draggableElement.setAttribute('data-x', '0');
        draggableElement.setAttribute('data-y', '0');
    });

    // Dismiss the loading spinner after a delay to simulate the game resetting
    setTimeout(() => {
      loading.dismiss();
    }, 1000);  // Adjust the delay as needed
}

  async presentWelcomeModal() {
    const modal = await this.modalController.create({
      component: WelcomeModalPagePage,
    });
  
    await modal.present();
  }
  
}

