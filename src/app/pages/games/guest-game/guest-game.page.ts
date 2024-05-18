import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-game',
  templateUrl: './guest-game.page.html',
  styleUrls: ['./guest-game.page.scss'],
})
export class GuestGamePage implements OnInit {

  showWelcomeMessage: boolean = true;
  hearts: number = 3;
  animals: { name: string, image: string }[] = [
    { name: 'Dog', image: 'assets/animals/dog.png' },
    { name: 'Cat', image: 'assets/animals/cat.png' },
    { name: 'Bird', image: 'assets/animals/bird.png' },
    { name: 'Ducks', image: 'assets/animals/ducks2.png' },
    { name: 'Monkey', image: 'assets/animals/monkey.png' },
    { name: 'Cow', image: 'assets/animals/cow.png' },
    // Add more animals as needed
  ];

  showWinPopup: boolean = false;
  showLosePopup: boolean = false;
  currentRound: number = 0;
  currentAnimalIndex: number = 0;
  shuffledNames: string[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  startGame() {
    this.showWelcomeMessage = false;
    this.hearts = 3;
    this.shuffleNames();
    this.nextRound();
    this.playButtonClickSound();
    this.yaySound();
  }

  shuffleNames() {
    const names = this.animals.map(animal => animal.name);
    this.shuffledNames = this.shuffleArray(names);
  }

  shuffleArray(array: any[]): any[] {
    // Shuffle array using Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  nextRound() {
    if (this.currentRound < this.animals.length) {
      this.currentRound++;
      this.currentAnimalIndex = this.currentRound - 1; // Update currentAnimalIndex
      this.shuffleNames(); // Shuffle animal names for the current round
    } else {
      console.log("All rounds completed");
    }
  }

  checkAnswer(name: string) {
    if (name === this.animals[this.currentAnimalIndex].name) {
         // Correct Answer
    if (this.currentAnimalIndex === this.animals.length - 1) {
      // Last animal correctly guessed, show win popup
      this.showWinPopup = true;
      this.yaySound();
      console.log("Congratulations! You won!");
    } else {
      // Continue to the next round
      this.nextRound();
    }
    } else {
      this.hearts--; // Decrease hearts count for wrong guess
      if (this.hearts === 0) {
        // Game Over
        this.showLosePopup = true;
        this.sadSound();
        console.log("Game Over");
      } else {
        console.log("Wrong Answer");
      }
    }
    this.playButtonClickSound();
  }

  generateArray(length: number): any[] {
    return Array.from({ length }, (_, i) => i);
  }

  retry() {
    this.showWelcomeMessage = true;
    this.hearts = 3;
    this.currentRound = 0; 
    this.currentAnimalIndex = 0;
    this.showWinPopup = false;
    this.showLosePopup = false;
    this.playButtonClickSound();
  }

  quit() {
    console.log('Quitting the game');
    this.showWinPopup = false;
    this.showLosePopup = false;
    this.router.navigate(['/search-games']);
    this.playButtonClickSound();
  }

  closeWelcomeMessage() {
    this.showWelcomeMessage = false;
    this.playButtonClickSound();
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }

  yaySound() {
    const audio = new Audio();
    audio.src = 'assets/yay.mp3';
    audio.load();
    audio.play();
  }

  sadSound() {
    const audio = new Audio();
    audio.src = 'assets/sad.mp3';
    audio.load();
    audio.play();
  }

}
