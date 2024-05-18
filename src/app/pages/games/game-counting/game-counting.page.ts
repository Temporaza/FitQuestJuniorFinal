import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-counting',
  templateUrl: './game-counting.page.html',
  styleUrls: ['./game-counting.page.scss'],
})
export class GameCountingPage implements OnInit {

  @ViewChild('popSound', { static: false }) popSound: ElementRef;

  balloonRows: { letter: string; popped: boolean; color: string }[][] = [];
  expectedNextLetter: string = 'A';
  totalBalloons: number = 0;
  showWinPopup: boolean = false;
  totalAlphabets: number = 26;


  constructor(
    private modalController: ModalController,
    private router: Router
  ) {
    this.initializeBalloons();
   }


  ngOnInit() {
  }

  initializeBalloons() {
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#e67e22'];
    const balloonsPerRow = 4; // Adjusted to match the total number of alphabets
    const totalRows = 7;

    // Create an array with alphabets (A to Z)
    const alphabets = Array.from({ length: this.totalAlphabets }, (_, index) => String.fromCharCode(65 + index));

    // Shuffle the array of alphabets
    for (let i = alphabets.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [alphabets[i], alphabets[randomIndex]] = [alphabets[randomIndex], alphabets[i]];
    }

    // Assign the shuffled alphabets to the balloons in all rows
    let currentIndex = 0;
    for (let i = 0; i < totalRows; i++) {
      const row: { letter: string; popped: boolean; color: string }[] = [];
      for (let j = 0; j < balloonsPerRow; j++) {
        if (currentIndex < this.totalAlphabets) {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const balloon = { letter: alphabets[currentIndex++], popped: false, color: randomColor };
          row.push(balloon);
          this.totalBalloons++;
        }
      }
      this.balloonRows.push(row);
    }
  }
  

  popBalloon(balloon: { letter: string; popped: boolean; color: string }) {
    if (!balloon.popped && balloon.letter === this.expectedNextLetter) {
      balloon.popped = true;

      // Play the balloon pop sound
      const audio = this.popSound.nativeElement as HTMLAudioElement;
      audio.currentTime = 0; // Reset the audio to play it from the beginning
      audio.play();

      // Increment the expected next letter
      this.expectedNextLetter = String.fromCharCode(this.expectedNextLetter.charCodeAt(0) + 1);

      // Check if the player has won the game
      if (this.expectedNextLetter > 'Z') { // All alphabets popped
        this.gameWon();
      }
    }
  }

  gameWon() {
    // Add your logic here for what happens when the player wins the game
    console.log('Congratulations! You won the game!');
    this.showWinPopup = true;
    this.yaySound();
  }

  retry() {
    // Add logic for retrying the game
    console.log('Retrying the game');
    this.showWinPopup = false;
    this.resetGame(); // You need to implement the resetGame() method
  }

  quit() {
    // Add logic for quitting the game
    console.log('Quitting the game');
    this.showWinPopup = false;

    // Navigate to the search-games page
    this.router.navigate(['/search-games']); // Replace '/search-games' with your actual route
  }

  resetGame() {
    // Reset your game logic and initialize balloons again
    this.balloonRows = [];
    this.expectedNextLetter = 'A';
    this.totalBalloons = 0;
    this.initializeBalloons();
  }
  yaySound() {
    const audio = new Audio();
    audio.src = 'assets/yay.mp3';
    audio.load();
    audio.play();
  }

}
