import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { ModalController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
  

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    console.log('User data:', this.user);
    this.bday.birthday = this.formatDate(this.bday.birthday);
    this.logRemainingDaysUntilBirthday();

    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.firestore.collection('users').doc(userId).get().subscribe(doc => {
          if (doc.exists) {
            const userData = doc.data() as UserData; // Type assertion
            this.isRewardReceived = userData.rewardsReceived || false;
            this.totalRemainingDays = userData.remainingDays || 0; // Fetch remaining days from Firestore
            this.logRemainingDaysUntilBirthday(); // Ensure remaining days are updated
          }
        });
      }
    });
  }

  

  ionViewDidEnter() {
    this.logCurrentDateTime();
    this.logRemainingDaysUntilBirthday()
     console.log('User ID:', this.user ? this.user.uid : 'No user ID available');
    console.log('Current user login:', this.user ? this.user.email : 'No user logged in');
    console.log("Birthday of User", this.bday? this.bday.birthday: 'No Birthday')
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
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    // Log the current date and time
    console.log('Current Date:', formattedDate);
    console.log('Current Time:', formattedTime);
  }

  logRemainingDaysUntilBirthday() {
    const userBirthday = new Date(this.bday.birthday);
    const currentDate = new Date();
  
    let remainingMonths = userBirthday.getMonth() - currentDate.getMonth();
    let remainingDays = userBirthday.getDate() - currentDate.getDate();
  
    if (remainingMonths < 0 || (remainingMonths === 0 && remainingDays < 0)) {
      remainingMonths += 12; // Add 12 months if the user's birthday month has passed
      const nextBirthdayYear = currentDate.getFullYear() + 1;
      const nextBirthday = new Date(nextBirthdayYear, userBirthday.getMonth(), userBirthday.getDate());
      const timeDifference = nextBirthday.getTime() - currentDate.getTime();
      remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    }
  
    // If remainingDays is negative, adjust the remainingMonths accordingly
    if (remainingDays < 0) {
      remainingMonths -= 1;
      remainingDays += new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    }
  
    // Calculate total remaining days
    this.totalRemainingDays = remainingMonths * 30 + remainingDays;
  
    this.remainingTime = `${remainingMonths} months and ${remainingDays} days`;
    console.log(`Remaining time until user's next birthday: ${remainingMonths} months and ${remainingDays} days`);
  }
  
  
 receiveRewards() {
  console.log('Receive rewards function called.');

  this.afAuth.authState.subscribe(user => {
    if (user) {
      const userId = user.uid; // Get the user ID directly from Firebase Authentication
      console.log('User ID from Received Rewards:', userId);
      
      // Update rewardsReceived flag and remaining days in Firestore
      this.firestore.collection('users').doc(userId).update({
        rewardsReceived: true,
        remainingDays: 365 // Reset remaining days to 365 when rewards are received
      }).then(() => {
        console.log('Rewards received flag and remaining days updated in Firestore.');
        this.isRewardReceived = true;
        this.totalRemainingDays = 365;
        this.remainingTime = '12 months and 0 days'; // Assuming a year has 12 months

        // Calculate remaining months and days
        const currentDate = new Date();
        const userBirthday = new Date(this.bday.birthday);
        let remainingMonths = userBirthday.getMonth() - currentDate.getMonth();
        let remainingDays = userBirthday.getDate() - currentDate.getDate();

        if (remainingMonths < 0 || (remainingMonths === 0 && remainingDays < 0)) {
          remainingMonths += 12; // Add 12 months if the user's birthday month has passed
          const nextBirthdayYear = currentDate.getFullYear() + 1;
          const nextBirthday = new Date(nextBirthdayYear, userBirthday.getMonth(), userBirthday.getDate());
          const timeDifference = nextBirthday.getTime() - currentDate.getTime();
          remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        }

        // If remainingDays is negative, adjust the remainingMonths accordingly
        if (remainingDays < 0) {
          remainingMonths -= 1;
          remainingDays += new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        }

        // Update remaining months and days in Firestore
        this.firestore.collection('users').doc(userId).update({
          remainingMonths: remainingMonths,
          remainingDays: remainingDays
        }).then(() => {
          console.log('Remaining months and days updated in Firestore.');
        }).catch(error => {
          console.error('Error updating remaining months and days:', error);
        });
      }).catch(error => {
        console.error('Error updating rewards received flag and remaining days:', error);
      });

      // Update totalPoints field in the document
      this.firestore.collection('users').doc(userId).get().subscribe(doc => {
        if (doc.exists) {
          const userData = doc.data() as { totalPoints?: number }; 
          const currentPoints = userData.totalPoints || 0;
          const newTotalPoints = currentPoints + 50;
          console.log('New total points:', newTotalPoints);
          
          this.firestore.collection('users').doc(userId).update({
            totalPoints: newTotalPoints
          }).then(() => {
            console.log('50 points added to totalPoints in Firestore.');
          }).catch((error) => {
            console.error('Error adding points to totalPoints in Firestore:', error);
          });
        } else {
          console.error('User does not exist in the users collection.');
        }
      });
    } else {
      console.error('User is not logged in.');
    }
  });
}

  
  
  
  
  
  
  
  formatDate(birthday: string): string {
  const date = new Date(birthday);

  // Define an array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
