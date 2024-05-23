import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChangeDetectorRef } from '@angular/core';

interface UserData {
  rewardsReceived?: boolean;
  remainingDays?: number;
  // Add other fields as needed
}

@Component({
  selector: 'app-birthday-modal',
  templateUrl: './birthday-modal.page.html',
  styleUrls: ['./birthday-modal.page.scss'],
})
export class BirthdayModalPage implements OnInit {
  @Input() user: any;
  @Input() bday: any;
  remainingTime: string;
  totalRemainingDays: number;
  isRewardReceived: boolean = false;
  isCurrentBirthday: boolean = false;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('User data:', this.user);
    this.bday.birthday = this.formatDate(this.bday.birthday);
    this.logRemainingDaysUntilBirthday();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        this.firestore
          .collection('users')
          .doc(userId)
          .get()
          .subscribe((doc) => {
            if (doc.exists) {
              const userData = doc.data() as UserData; // Type assertion
              this.isRewardReceived = userData.rewardsReceived || false;
              this.totalRemainingDays = userData.remainingDays || 0; // Fetch remaining days from Firestore
              this.logRemainingDaysUntilBirthday(); // Ensure remaining days are updated
              this.isCurrentBirthday = this.totalRemainingDays === 0;
              this.cdRef.detectChanges();
              console.log('isCurrentBirthday:', this.isCurrentBirthday);
              console.log('isRewardReceived:', this.isRewardReceived);
              console.log('totalRemainingDays:', this.totalRemainingDays);
            }
          });
      }
    });
  }

  ionViewDidEnter() {
    this.logCurrentDateTime();
    this.logRemainingDaysUntilBirthday();
    console.log('User ID:', this.user ? this.user.uid : 'No user ID available');
    console.log(
      'Current user login:',
      this.user ? this.user.email : 'No user logged in'
    );
    console.log(
      'Birthday of User',
      this.bday ? this.bday.birthday : 'No Birthday'
    );
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  logCurrentDateTime() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the date and time components for display
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    }`;
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }:${seconds < 10 ? '0' + seconds : seconds}`;

    // Log the current date and time
    console.log('Current Date:', formattedDate);
    console.log('Current Time:', formattedTime);
  }

  logRemainingDaysUntilBirthday() {
    const userBirthday = new Date(this.bday.birthday);
    const currentDate = new Date();

    let remainingMonths = userBirthday.getMonth() - currentDate.getMonth();
    let remainingDays = userBirthday.getDate() - currentDate.getDate();

    // Check if the user's birthday month has already passed
    if (remainingMonths < 0 || (remainingMonths === 0 && remainingDays < 0)) {
      remainingMonths += 12; // Add 12 months if the user's birthday month has passed
      const nextBirthdayYear = currentDate.getFullYear() + 1;
      const nextBirthday = new Date(
        nextBirthdayYear,
        userBirthday.getMonth(),
        userBirthday.getDate()
      );
      const timeDifference = nextBirthday.getTime() - currentDate.getTime();
      const daysUntilNextBirthday = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
      );

      // Calculate remaining days in the user's birth month
      const daysInBirthMonth = new Date(
        userBirthday.getFullYear(),
        userBirthday.getMonth() + 1,
        0
      ).getDate();
      remainingDays =
        daysInBirthMonth - currentDate.getDate() + userBirthday.getDate();

      // If the remaining days exceed the days until the next birthday, adjust remaining months and days
      if (remainingDays > daysUntilNextBirthday) {
        remainingMonths -= 1;
        remainingDays -= daysUntilNextBirthday;
      }
    }

    // If remainingDays is negative, adjust the remainingMonths accordingly
    if (remainingDays < 0) {
      remainingMonths -= 1;
      const daysInLastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      remainingDays += daysInLastMonth;
    }

    // Calculate total remaining days
    const totalRemainingDays = remainingMonths * 30 + remainingDays;

    this.totalRemainingDays = totalRemainingDays;
    this.remainingTime = `${remainingMonths} months and ${remainingDays} days`;
    console.log(
      `Remaining time until user's next birthday: ${remainingMonths} months and ${remainingDays} days`
    );
  }

  receiveRewards() {
    console.log('Receive rewards function called.');

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid; // Get the user ID directly from Firebase Authentication
        console.log('User ID from Received Rewards:', userId);

        // Update rewardsReceived flag and remaining days in Firestore
        this.firestore
          .collection('users')
          .doc(userId)
          .update({
            rewardsReceived: true,
            remainingDays: 365, // Reset remaining days to 365 when rewards are received
          })
          .then(() => {
            console.log(
              'Rewards received flag and remaining days updated in Firestore.'
            );
            this.isRewardReceived = true;
            this.totalRemainingDays = 365;

            // Recalculate remaining time
            this.resetRemainingTime();

            // Update totalPoints field in the document
            this.firestore
              .collection('users')
              .doc(userId)
              .get()
              .subscribe((doc) => {
                if (doc.exists) {
                  const userData = doc.data() as { totalPoints?: number };
                  const currentPoints = userData.totalPoints || 0;
                  const newTotalPoints = currentPoints + 50;
                  console.log('New total points:', newTotalPoints);

                  this.firestore
                    .collection('users')
                    .doc(userId)
                    .update({
                      totalPoints: newTotalPoints,
                    })
                    .then(() => {
                      console.log(
                        '50 points added to totalPoints in Firestore.'
                      );
                    })
                    .catch((error) => {
                      console.error(
                        'Error adding points to totalPoints in Firestore:',
                        error
                      );
                    });
                } else {
                  console.error('User does not exist in the users collection.');
                }
              });
          })
          .catch((error) => {
            console.error(
              'Error updating rewards received flag and remaining days:',
              error
            );
          });
      } else {
        console.error('User is not logged in.');
      }
    });
  }

  resetRemainingTime() {
    const currentDate = new Date();
    const nextBirthday = new Date(
      currentDate.getFullYear() + 1,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const remainingMonths = 12; // Because we are resetting to exactly one year from today
    const remainingDays = 0;

    this.totalRemainingDays = remainingMonths * 30 + remainingDays; // Assuming each month has 30 days
    this.remainingTime = `${remainingMonths} months and ${remainingDays} days`;
    this.isCurrentBirthday = false;

    console.log(
      `Remaining time reset: ${remainingMonths} months and ${remainingDays} days`
    );
  }

  formatDate(birthday: string): string {
    const date = new Date(birthday);

    // Define an array of month names
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Get the month, day, and year from the Date object
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const formattedDate = `${month} ${day < 10 ? '0' + day : day}, ${year}`;

    return formattedDate;
  }

  yaySound() {
    const audio = new Audio();
    audio.src = 'assets/yay.mp3';
    audio.load();
    audio.play();
  }
}
