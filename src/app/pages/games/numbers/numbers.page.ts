import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-numbers',
  templateUrl: './numbers.page.html',
  styleUrls: ['./numbers.page.scss'],
})
export class NumbersPage implements OnInit {
  @ViewChild('popSound', { static: false }) popSound: ElementRef;

  balloonRows: { number: number; popped: boolean; color: string }[][] = [];
  expectedNextNumber: number = 1; // Initialize with the first expected number
  totalBalloons: number = 0;
  showWinPopup: boolean = false;
  showWelcomeMessage: boolean = true;

  constructor(
    private modalController: ModalController,
    private router: Router
  ) {
    this.initializeBalloons();
  }

  startGame() {
    this.showWelcomeMessage = false;
    this.yaySound();
    this.playButtonClickSound();
  }

  ngOnInit() {}

  initializeBalloons() {
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#e67e22']; // Yellow, Red, Blue, Orange
    const totalRows = 4;
    const balloonsPerRow = 5;

    // Create an array with numbers 1 to (totalRows * balloonsPerRow)
    const numbers = Array.from(
      { length: totalRows * balloonsPerRow },
      (_, index) => index + 1
    );

    // Shuffle the array of numbers
    for (let i = numbers.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
    }

    // Assign the shuffled numbers to the balloons in all rows
    let currentIndex = 0;
    for (let i = 0; i < totalRows; i++) {
      const row: { number: number; popped: boolean; color: string }[] = [];
      for (let j = 0; j < balloonsPerRow; j++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const balloon = {
          number: numbers[currentIndex++],
          popped: false,
          color: randomColor,
        };
        row.push(balloon);

        // Increment the total number of balloons
        this.totalBalloons++;
      }
      this.balloonRows.push(row);
    }
  }

  popBalloon(balloon: { number: number; popped: boolean; color: string }) {
    if (!balloon.popped && balloon.number === this.expectedNextNumber) {
      balloon.popped = true;

      // Play the balloon pop sound
      const audio = this.popSound.nativeElement as HTMLAudioElement;
      audio.currentTime = 0; // Reset the audio to play it from the beginning
      audio.play();

      // Increment the expected next number
      this.expectedNextNumber++;

      // Check if the player has won the game
      if (this.expectedNextNumber > this.totalBalloons) {
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
    this.expectedNextNumber = 1;
    this.totalBalloons = 0;
    this.initializeBalloons();
  }

  yaySound() {
    const audio = new Audio();
    audio.src = 'assets/yay.mp3';
    audio.load();
    audio.play();
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }
}
