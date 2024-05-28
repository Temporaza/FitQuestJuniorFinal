import {
  Component,
  OnDestroy,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { PetBodyServiceService } from '../services/pet-body.service.service';
import { TaskStatusService } from '../services/task-status.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChangeDetectorRef } from '@angular/core';

import { interval, Subscription } from 'rxjs';

import { PointsServiceService } from 'src/app/services/points.service.service';
import { CdkDragStart, CdkDragEnd, CdkDrag } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { PetHatServiceService } from '../services/pet-hat-service.service';
import { BirthdayModalPage } from '../modals/birthday-modal/birthday-modal.page';

interface UserData {
  role: string;
  height: number;
  status: string;
  usersUID: string;
  bmi: number;
  email: string;
  fullname: string;
  petBodyUrl: string;
  petHealth: number;
  petName: string;
  birthday: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;
  isAudioPlaying: boolean = true;

  // Properties to store download URLs
  petEyesUrl: string;
  petMouthUrl: string;
  petBodyUrl: string;
  // petHatUrl: string;

  petHatSubscription: Subscription;

  selectedPetBodyUrl: string;

  totalPoints: number = 0; // Initialize with a default value

  clickCount: number = 0;
  angryEyesUrl: string = 'assets/eyes/eye4.png';

  // currentHealth: number = 80;
  petHealth: number;

  showYumImage: boolean = false;
  showHmmImage: boolean = false;

  showCookieImage: boolean = false;
  availableCookies: number = 10;

  petName: string;

  healthRangeMap = [
    {
      min: 81,
      max: 100,
      eyes: '/assets/eyes/eye1.png',
      mouth: '/assets/Mouth/M3.png',
    },
    {
      min: 51,
      max: 80,
      eyes: '/assets/eyes/eye2.png',
      mouth: '/assets/Mouth/M3.png',
    },
    {
      min: 41,
      max: 50,
      eyes: '/assets/eyes/eye3.png',
      mouth: '/assets/Mouth/mouth2.png',
    },
    {
      min: 11,
      max: 40,
      eyes: '/assets/eyes/eye4.png',
      mouth: '/assets/Mouth/mouth1.png',
    },
    {
      min: 0,
      max: 10,
      eyes: '/assets/eyes/eye5.png',
      mouth: '/assets/Mouth/mouth1.png',
    },
  ];

  editMode: boolean = false;
  newPetName: string = '';
  originalPetName: string = '';

  private healthUpdateSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(
    public authService: AuthenticationService,
    public route: Router,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    private petBodyService: PetBodyServiceService,
    private taskStatusService: TaskStatusService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private cdr: ChangeDetectorRef,
    private alertControler: AlertController,
    private pointsService: PointsServiceService,
    private renderer: Renderer2,
    private location: Location,
    private petHatService: PetHatServiceService,
    private modalController: ModalController
  ) {
    this.user = authService.getProfile;

    // this.petHatSubscription = this.petHatService.selectedPetHatUrl$.subscribe(
    //   (hatUrl) => {
    //     this.petHatUrl = hatUrl;
    //   }
    // );

    // Subscribe to changes in the task status
    this.taskStatusService.getTaskStatus().subscribe((statusWithPoints) => {
      const { status, points } = statusWithPoints;

      if (status === 'Completed') {
        this.updateTotalPoints(points);
      }
    });

    this.startHealthUpdateInterval();
  }

  updateTotalPoints(newPoints: number) {
    this.totalPoints += newPoints;
  }

  ngOnDestroy() {
    this.stopHealthUpdateInterval();
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    // if (this.petHatSubscription) {
    //   this.petHatSubscription.unsubscribe();
    // }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.location.forward();
  }

  enableEditNameMode() {
    this.newPetName = this.petName; // Initialize the input with the current pet name
    this.editMode = true;
    this.playButtonClickSound();
  }

  async saveNewPetName() {
    const currentUser = await this.authService.getCurrentUser();
    this.playButtonClickSound();
    if (currentUser) {
      try {
        const userId = currentUser.uid;
        await this.firestore.collection('users').doc(userId).update({
          petName: this.newPetName,
        });
        this.petName = this.newPetName; // Update the displayed pet name
        this.editMode = false; // Exit edit mode
      } catch (error) {
        console.error('Error updating pet name:', error);
      }
    }
  }

  cancelEditNameMode() {
    // Cancel edit mode and revert changes
    this.editMode = false;
    this.newPetName = this.originalPetName;
    this.playButtonClickSound();
  }

  isBackgroundEnabled(): boolean {
    return !this.editMode;
  }

  async ionViewDidEnter() {
    this.createLoading();
    // this.playBackgroundMusic();

    this.fetchPetImages();

    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      await this.fetchPetHealth(currentUser.uid);

      if (!this.petBodyUrl) {
        this.setDefaultPetBodyUrl();
      }
      await this.fetchPetImages();
      this.updatePetImages();
    }
  }

  ngOnInit() {
    this.checkUser();
    this.pointsService.points$.subscribe((points) => {
      this.totalPoints = points;
    });
  }

  ngAfterViewInit() {
    this.taskStatusService.getTotalPoints().subscribe((totalPoints) => {
      this.totalPoints = totalPoints;
      // Manually trigger change detection
      this.cdr.detectChanges();
    });
  }

  checkUser() {
    this.authSubscription = this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        try {
          const userId = user.uid;

          await this.fetchTotalPoints(userId);

          console.log('User ID:', userId);

          const totalPoints =
            await this.taskStatusService.getTotalPointsFromFirestore(userId);

          this.taskStatusService.setTotalPoints(totalPoints);

          const userDoc = await this.firestore
            .collection('users')
            .doc(userId)
            .get()
            .toPromise();

          if (userDoc.exists) {
            this.petBodyUrl = userDoc.get('petBodyUrl');
            // this.petHatUrl = userDoc.get('petHatUrl');
            this.petName = userDoc.get('petName');

            console.log('Selected PetBodyImage URL:', this.petBodyUrl);
            // console.log('Selected PetHatImage URL:', this.petHatUrl);

            this.petBodyService.setSelectedPetBodyUrl(this.petBodyUrl);
            // this.petBodyService.setSelectedPetHatUrl(this.petHatUrl);
          } else {
            console.error('User document not found.');
          }
          await this.fetchPetImages();

          // Other initialization code
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.error('User not authenticated.');
        // Handle the case when the user is not authenticated
        // For example, redirect to the login page
        // this.route.navigate(['/login']);
      }
    });
  }

  async fetchPetImages() {
    const loading = await this.createLoading();
    try {
      await loading.present();

      this.petEyesUrl = await this.getDownloadUrl('eyes', 'eye1.png');
      this.petMouthUrl = await this.getDownloadUrl('Mouth', 'M3.png');
      // this.petHatUrl = this.petBodyService.getSelectedPetHatUrl() || '';
      this.petBodyUrl = this.petBodyService.getSelectedPetBodyUrl() || '';
    } catch (error) {
      console.error('Error fetching pet images:', error);
    } finally {
      // Dismiss the loading spinner whether successful or not
      await loading.dismiss();
    }
  }

  async createLoading() {
    const loading = await this.loadingController.create({
      message: 'Preparing your pet...', // You can customize the loading message
      spinner: 'lines-sharp',
      translucent: true,
      cssClass: 'custom-loading-class', // Add a custom CSS class if needed
    });
    return loading;
  }

  async getDownloadUrl(part: string, imageName: string): Promise<string> {
    const imagePath = `PetDefault/${part}/${imageName}`;
    const storageRef = this.storage.ref(imagePath);
    return storageRef.getDownloadURL().toPromise();
  }
  //End of fetching

  async logout() {
    this.playButtonClickSound();
    this.pauseBackgroundMusic();

    const alert = await this.alertControler.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Handle cancel action if needed
            console.log('Logout canceled');
          },
        },
        {
          text: 'Logout',
          handler: async () => {
            try {
              await this.authService.signOut();

              // Clear the local total points subject
              this.taskStatusService.setTotalPoints(0);

              // Wait for the sign-out operation to complete
              const isAuthenticated = await this.authService.isAuthenticated();

              if (!isAuthenticated) {
                // After logging out, navigate to the login page and clear history
                this.route.navigate(['/landing'], { replaceUrl: true });

                // Log the message when the user is not authenticated
                console.log('User is not authenticated.');
              }
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  toggleAudio() {
    const audio = document.getElementById(
      'backgroundMusic'
    ) as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        this.playBackgroundMusic();
      } else {
        this.pauseBackgroundMusic();
      }
    }
  }

  private playBackgroundMusic() {
    const audio = document.getElementById(
      'backgroundMusic'
    ) as HTMLAudioElement;
    if (audio) {
      audio
        .play()
        .then(() => {
          this.isAudioPlaying = true;
        })
        .catch((error) => {
          console.log('Failed to play background music:', error.message);
        });
    }
  }

  private pauseBackgroundMusic() {
    this.playButtonClickSound();
    const audio = document.getElementById(
      'backgroundMusic'
    ) as HTMLAudioElement;
    if (audio) {
      audio.pause();
      this.isAudioPlaying = false;
    }
  }

  async fetchTotalPoints(userId: string) {
    try {
      // Fetch total points using the user ID
      const totalPoints =
        await this.taskStatusService.getTotalPointsFromFirestore(userId);

      // Update the total points in the local subject
      this.taskStatusService.setTotalPoints(totalPoints);
    } catch (error) {
      console.error('Error fetching total points:', error);
    }
  }

  handlePetClick() {
    this.playButtonClickSound();
    this.clickCount++;

    // Check if click count is 5
    if (this.clickCount === 5) {
      // Change eyes to angry eyes for 1 second
      this.petEyesUrl = this.angryEyesUrl;
      this.showHmmImage = true;

      // After 1 second, reset eyes to the original state
      setTimeout(() => {
        this.petEyesUrl = '/assets/eyes/eye1.png';
        this.showHmmImage = false; // Replace with the original eyes image
      }, 1000);

      // Reset click count
      this.clickCount = 0;
    }

    console.log('Number of clicks on pet body:', this.clickCount);
  }

  handleSaladClick() {
    this.playButtonClickSound();
    // Show the cookie image
    this.showCookieImage = true;

    // Use a timeout to ensure the DOM is fully loaded before accessing elements
    setTimeout(() => {
      // Start the drag action programmatically
      const cookieElement = document.querySelector(
        '.cookie-image'
      ) as HTMLElement;
      if (cookieElement) {
        cookieElement.style.position = 'absolute';
        cookieElement.style.zIndex = '9999'; // Ensure the cookie is above other elements
        const cookieDragEvent = new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          clientX: 0,
          clientY: 0,
        });
        cookieElement.dispatchEvent(cookieDragEvent);

        console.log('Cookie is shown.');
      } else {
        console.error('Cookie element not found.');
      }
    }, 0);
  }

  handleCookieDragged(event: CdkDragEnd) {
    const cookieImage = event.source.element.nativeElement;
    const petMouth = document.querySelector('.pet-mouth') as HTMLElement;

    const cookieRect = cookieImage.getBoundingClientRect();
    const petMouthRect = petMouth.getBoundingClientRect();

    if (
      cookieRect.left < petMouthRect.right &&
      cookieRect.right > petMouthRect.left &&
      cookieRect.top < petMouthRect.bottom &&
      cookieRect.bottom > petMouthRect.top
    ) {
      this.playEatSound();
      console.log("Cookie collided with the pet's mouth!");

      // Hide the cookie image
      this.showCookieImage = false;

      // Change the pet-mouth image to M4.png
      this.petMouthUrl = '/assets/Mouth/M4.png';

      // Add health to the pet
      const newHealth = Math.min(this.petHealth + 10, 100); // Increase health by 10 (adjust as needed)
      this.updatePetHealth(newHealth);

      setTimeout(() => {
        this.showYumImage = true;
        setTimeout(() => {
          this.showYumImage = false;
        }, 2000);
      }, 500);
      setTimeout(() => {
        this.petMouthUrl = '/assets/Mouth/mouth1.png';
      }, 1000);
    }
  }

  async fetchPetHealth(userId: string) {
    try {
      console.log('Fetching pet health for user ID:', userId);

      const userDoc = await this.firestore
        .collection('users')
        .doc(userId)
        .get()
        .toPromise();

      if (userDoc.exists) {
        const petHealth = userDoc.get('petHealth');

        // Check if petHealth is a valid number
        if (typeof petHealth === 'number' && !isNaN(petHealth)) {
          this.petHealth = petHealth;
          console.log('Fetched pet health:', this.petHealth);
          this.updatePetImages();
        } else {
          console.error(
            'Invalid petHealth value fetched from Firestore:',
            petHealth
          );
          // Handle the case of invalid petHealth value, perhaps set a default value
          this.petHealth = 100; // Set a default value
        }
      } else {
        console.error('User document does not exist for user ID:', userId);
      }
    } catch (error) {
      console.error('Error fetching pet health:', error);
    }
  }

  updatePetImages() {
    console.log('Current pet health:', this.petHealth);
    const matchingRange = this.healthRangeMap.find(
      (range) => this.petHealth >= range.min && this.petHealth <= range.max
    );

    if (matchingRange) {
      this.petEyesUrl = matchingRange.eyes;
      this.petMouthUrl = matchingRange.mouth;
    } else {
      console.error('Pet health value does not match any range.');
    }
  }

  startHealthUpdateInterval() {
    console.log('startHealthUpdateInterval called');

    this.healthUpdateSubscription = interval(100000).subscribe(() => {
      const newHealth = this.petHealth - 10;
      const updatedHealth = Math.max(newHealth, 0);

      this.updatePetHealth(updatedHealth);
      this.updatePetImages(); // Update images based on the current health
    });
  }

  stopHealthUpdateInterval() {
    // Unsubscribe from the health update interval to avoid memory leaks
    if (this.healthUpdateSubscription) {
      this.healthUpdateSubscription.unsubscribe();
    }
  }

  async updatePetHealth(newHealth: number) {
    // Update the pet's health in the local variable and in the Firestore document
    this.petHealth = newHealth;

    // Save the updated pet health to Firestore
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userId = (await currentUser).uid;
      this.firestore
        .collection('users')
        .doc(userId)
        .update({ petHealth: newHealth })
        .then(() => {
          console.log('Pet health updated successfully.');
        })
        .catch((error) => {
          console.error('Error updating pet health:', error);
        });
    }
  }

  private async setDefaultPetBodyUrl() {
    // Set the parameters for the default pet body image
    const part = 'Body';
    const imageName = 'Normal.png';

    // Fetch the current user
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      const userId = (await currentUser).uid;

      // Fetch the user document from Firestore
      const userDoc = await this.firestore
        .collection('users')
        .doc(userId)
        .get()
        .toPromise();

      // Check if the user document exists and if petBodyUrl is not set
      if (userDoc.exists && !userDoc.get('petBodyUrl')) {
        // Get the download URL for the default pet body image
        this.getDownloadUrl(part, imageName)
          .then((url) => {
            // Update the pet body URL in the local variable
            this.petBodyUrl = url;

            // Save the default pet body URL to Firestore
            this.firestore
              .collection('users')
              .doc(userId)
              .update({ petBodyUrl: url })
              .then(() => {
                console.log('Default pet body URL set successfully.');
              })
              .catch((error) => {
                console.error('Error setting default pet body URL:', error);
              });
          })
          .catch((error) => {
            console.error('Error fetching default pet body URL:', error);
          });
      } else {
        // Use the existing pet body URL from Firestore if available
        this.petBodyUrl = userDoc.get('petBodyUrl');
      }
    }
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }

  playEatSound() {
    const audio = new Audio();
    audio.src = 'assets/eatSound.mp3';
    audio.load();
    audio.play();
  }

  async openBirthdayModal() {
    try {
      const user = await this.authService.getCurrentUser();
      // console.log('User object:', user);

      const userData = (await this.authService.getUserDataByUid(
        user.uid
      )) as UserData;
      console.log('User Data from Firestore:', userData);

      const userWithBirthday = { ...user, ...userData };

      const modal = await this.modalController.create({
        component: BirthdayModalPage,
        componentProps: {
          user: user,
          bday: userWithBirthday,
        },
      });
      return await modal.present();
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
}
