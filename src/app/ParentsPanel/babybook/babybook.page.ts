// babybook.page.ts

import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-babybook',
  templateUrl: './babybook.page.html',
  styleUrls: ['./babybook.page.scss'],
})
export class BabybookPage implements OnInit {
  images: string[] = [
    'assets/ebook/content/Ebook FitQuest Junior-01.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-02.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-03.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-04.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-06.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-07.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-08.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-09.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-10.jpg',

    'assets/ebook/content/Ebook FitQuest Junior-11.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-12.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-13.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-14.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-15.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-16.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-17.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-18.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-19.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-20.jpg',

    'assets/ebook/content/Ebook FitQuest Junior-21.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-22.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-23.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-24.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-25.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-26.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-27.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-28.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-29.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-30.jpg',

    'assets/ebook/content/Ebook FitQuest Junior-31.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-32.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-33.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-34.jpg',
    'assets/ebook/content/Ebook FitQuest Junior-35.jpg',
  ];

  currentPage: number = 0;

  constructor(private location: Location) {}

  ngOnInit() {}

  nextPage() {
    if (this.currentPage < this.images.length - 1) {
      this.currentPage++;
    }
    this.playButtonClickSound();
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
    this.playButtonClickSound();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.location.forward();
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }
}
