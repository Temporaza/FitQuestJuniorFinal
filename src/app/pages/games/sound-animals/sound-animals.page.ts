import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sound-animals',
  templateUrl: './sound-animals.page.html',
  styleUrls: ['./sound-animals.page.scss'],
})
export class SoundAnimalsPage implements OnInit {

  @ViewChild('audioPlayer') audioPlayer: ElementRef;

  animalList: string[] = [
    '/assets/animals/dog.png',
    '/assets/animals/cat.png',
    '/assets/animals/bird.png',
  ];

  soundList: string[] = [
    '/assets/shapes/music/bark.mp3',
    '/assets/shapes/music/meow.mp3',
    '/assets/shapes/music/tweet.mp3',
  ];

  currentIndex: number = 0;
  currentAnimalImage: string = this.animalList[this.currentIndex];
  isAudioPlaying: boolean = false; // Track the audio playing state
  showAnimalImage: boolean = false;
  isSoundIdentified: boolean = false;

  constructor(
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log('Initial Displayed Animal:', this.getCurrentAnimal());
  }

  showNextAnimal() {
    // Check if the text field is empty
    const enteredText = (document.querySelector('input[name="textInput"]') as HTMLInputElement).value;
    if (!enteredText.trim()) {
      // Show a toast if the text field is empty
      this.presentToast('Please enter text before proceeding.');
      return;
    }

    // Only allow going to the next animal if the sound has been correctly identified
    if (this.isSoundIdentified) {
      // Clear the text field
      (document.querySelector('input[name="textInput"]') as HTMLInputElement).value = '';

      // Reset the flag to hide the animal image
      this.showAnimalImage = false;

      this.currentIndex = (this.currentIndex + 1) % this.animalList.length;
      this.playAnimalSound();

      // Check if it's the last animal and has been correctly identified
      if (this.currentIndex === 0 && this.isSoundIdentified) {
        // Show congratulations alert
        alert('Congratulations! You identified all the animals.');

        // Provide a button to restart the game
        const restartGame = confirm('Do you want to restart the game?');
        if (restartGame) {
          this.restartGame();
        }
      }

      console.log('Current Displayed Animal:', this.getCurrentAnimal());
    }
  }
  
  restartGame() {
    // Reset all game variables
    this.currentIndex = 0;
    this.currentAnimalImage = this.animalList[this.currentIndex];
    this.isAudioPlaying = false;
    this.showAnimalImage = false;
    this.isSoundIdentified = false;
  
    // Play the sound for the first animal
    this.playAnimalSound();
  
    console.log('Game restarted.');
  }

  showPrevAnimal() {
    // Only allow going to the previous animal if the sound has been correctly identified
    if (this.isSoundIdentified) {
      this.currentIndex = (this.currentIndex - 1 + this.animalList.length) % this.animalList.length;
      this.playAnimalSound();
      console.log('Current Displayed Animal:', this.getCurrentAnimal());
    }
  }

  getCurrentAnimal(): string {
    return this.animalList[this.currentIndex];
  }

  playAnimalSound() {
    if (this.isAudioPlaying) {
      // If audio is playing, pause it and set the speaker icon to mute
      this.audioPlayer.nativeElement.pause();
    } else {
      // If audio is not playing, play it and set the speaker icon to volume-high
      this.audioPlayer.nativeElement.src = this.soundList[this.currentIndex];
      this.audioPlayer.nativeElement.play();
    }

    // Toggle the audio playing state
    this.isAudioPlaying = !this.isAudioPlaying;
  }

  submitText() {
    const enteredText = (document.querySelector('input[name="textInput"]') as HTMLInputElement).value;

    // Get the current animal name
    const currentAnimalName = this.getCurrentAnimalName().toLowerCase();

    // Check if entered text matches the current animal's name
    if (enteredText.toLowerCase() === currentAnimalName) {
      // Set the flag to indicate that the sound has been correctly identified
      this.isSoundIdentified = true;

      // Set the flag to show the animal image
      this.showAnimalImage = true;

      // Update current animal image based on the current index
      this.currentAnimalImage = this.animalList[this.currentIndex];

      // Log the current displayed animal
      console.log('Current Displayed Animal:', this.getCurrentAnimal());

      // Log a message when the entered text matches the displayed animal name
      console.log(`Entered text '${enteredText}' matches the displayed animal '${currentAnimalName}'`);

      // Show a success toast
      this.presentToast('Correct!');

    } else {
      // Show an error toast
      this.presentToast('Incorrect. Try again.');

      // Handle case when entered text does not match
      console.log('Entered text does not match the current animal name.');

      // Reset the flag to indicate that the sound has not been correctly identified
      this.isSoundIdentified = false;

      // Reset the flag to hide the animal image
      this.showAnimalImage = false;
    }
  }
  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  

  getCurrentAnimalName(): string {
    // Extract the animal name from the path (assuming the last part of the path is the name)
    const parts = this.animalList[this.currentIndex].split('/');
    return parts[parts.length - 1].replace('.png', '');
  }
}
