import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-custom-navigation',
  templateUrl: './custom-navigation.page.html',
  styleUrls: ['./custom-navigation.page.scss'],
})
export class CustomNavigationPage implements OnInit {
  @Input() imageUrl: string;
  @Input() routerLink: string;

  constructor(private router: Router, private navCtrl: NavController) {}

  ngOnInit() {}

  navigateToEBook() {
    this.navCtrl.navigateForward('/babyBook', { animated: false });
    this.playButtonClickSound();
  }

  navigateToConsultation() {
    this.navCtrl.navigateForward('/consultation', { animated: false });
    this.playButtonClickSound();
  }

  navigateToKids() {
    this.navCtrl.navigateForward('/vaccination', { animated: false });
    this.playButtonClickSound();
  }

  navigateToActivity() {
    this.navCtrl.navigateForward('/parents-acitvity', { animated: false });
    this.playButtonClickSound();
  }

  navigateToQuest() {
    this.navCtrl.navigateForward('/kids-progress', { animated: false });
    this.playButtonClickSound();
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }
}
