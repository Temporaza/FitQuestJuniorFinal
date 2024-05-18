import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from 'src/app/authentication.service';
import { PetBodyServiceService } from 'src/app/services/pet-body.service.service';
import { TaskStatusService } from 'src/app/services/task-status.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { PointsServiceService } from 'src/app/services/points.service.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class MarketPage implements OnInit {
  totalPoints: number = 0;
  currentCategory: string = 'bodies';

  // Properties to store download URLs
  petEyesUrl: string;
  petMouthUrl: string;
  petBodyUrl: string;

  // petHatUrl: string | null;

  selectedPetBodyUrl: string;

  isWizardHatEquipped: boolean = false;
  isSantaHatEquipped: boolean = false;

  //body parts
  duzzyUrl: string;
  big_YakUrl: string;
  curlyUrl: string;
  spikeyUrl: string;
  sumoUrl: string;
  wet_dogUrl: string;

  wizardPurpleUrl: string;
  santaUrl: string;

  isDuzzyOwned: boolean = false;
  isBigYakOwned: boolean = false;
  isCurlyOwned: boolean = false;
  isSpikeyOwned: boolean = false;
  isSumoOwned: boolean = false;
  isWetDogOwned: boolean = false;

  isWizardHatOwned: boolean = false;
  isSantaHatOwned: boolean = false;

  equippedHat: string | null = null;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private authService: AuthenticationService,
    private petBodyService: PetBodyServiceService,
    private taskStatusService: TaskStatusService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private pointsService: PointsServiceService,
    private loadingController: LoadingController,
    private location: Location
  ) {}

  updatePointsAfterPurchase(newPoints: number) {
    this.pointsService.updatePoints(newPoints);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.location.forward();
  }

  async ngOnInit() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      console.log('Current User:', currentUser);
      const userId = currentUser.uid;

      const totalPoints =
        await this.taskStatusService.getTotalPointsFromFirestore(userId);
      this.totalPoints = totalPoints;

      await this.fetchUserData(userId);

      // if (
      //   (this.isWizardHatEquipped || this.isSantaHatEquipped) &&
      //   this.petHatUrl
      // ) {
      //   if (this.isWizardHatEquipped) {
      //     this.petHatUrl = this.wizardPurpleUrl;
      //   } else if (this.isSantaHatEquipped) {
      //     this.petHatUrl = this.santaUrl;
      //   }
      // } else {
      //   this.petHatUrl = null;
      // }

      const userDocRef = this.firestore.collection('users').doc(userId);
      const userDocSnapshot = await userDocRef.get().toPromise();

      // const storedEquippedHat = localStorage.getItem('equippedHat');
      // if (storedEquippedHat === 'wizardHat') {
      //   this.equippedHat = 'wizardHat';
      //   this.isWizardHatEquipped = true;
      //   this.petHatUrl = this.wizardPurpleUrl;
      // } else if (storedEquippedHat === 'santaHat') {
      //   this.equippedHat = 'santaHat';
      //   this.isSantaHatEquipped = true;
      //   this.petHatUrl = this.santaUrl;
      // }

      if (userDocSnapshot.exists) {
        const userData = userDocSnapshot.data() as {
          petBodyUrl?: string; // Include other fields if needed
          petHatUrl?: string; // Include the hat URL field
        };

        this.petBodyUrl =
          userData && userData.petBodyUrl
            ? userData.petBodyUrl
            : 'default-pet-body-url';
        // this.petHatUrl =
        //   userData && userData.petHatUrl ? userData.petHatUrl : null;

        // Fetch other pet images
        this.petEyesUrl = await this.getDownloadUrl('mata', 'One.png');
        this.petMouthUrl = await this.getDownloadUrl('Mouth', 'M5.png');
        this.duzzyUrl = await this.getDownloadUrl('Body', 'Duzzy.png');
        this.big_YakUrl = await this.getDownloadUrl('Body', 'Big Yak.png');
        this.curlyUrl = await this.getDownloadUrl('Body', 'Curly.png');
        this.spikeyUrl = await this.getDownloadUrl('Body', 'Spikey.png');
        this.sumoUrl = await this.getDownloadUrl('Body', 'Sumo.png');
        this.wet_dogUrl = await this.getDownloadUrl('Body', 'WetDog.png');

        this.wizardPurpleUrl = await this.getDownloadUrl(
          'Hat',
          'wizardPurple.png'
        );
        this.santaUrl = await this.getDownloadUrl('Hat', 'santa.png');

        // Fetch the user's owned pet bodies from Firestore or another source
        const ownedPetBodies = await this.fetchOwnedPetBodies(userId);

        // Set the ownership flags based on the fetched data
        this.isDuzzyOwned = ownedPetBodies.includes('Duzzy');
        this.isBigYakOwned = ownedPetBodies.includes('BigYak');
        this.isCurlyOwned = ownedPetBodies.includes('Curly');
        this.isSpikeyOwned = ownedPetBodies.includes('Spikey');
        this.isSumoOwned = ownedPetBodies.includes('Sumo');
        this.isWetDogOwned = ownedPetBodies.includes('wetDog');

        // Check if the hat is equipped and update the flag
        // const ownedCosmetics = await this.getOwnedCosmetics();

        // Set the ownership flags based on the fetched data
        // this.isWizardHatOwned = ownedCosmetics.includes('wizardHat');
        // this.isSantaHatOwned = ownedCosmetics.includes('santaHat');
      } else {
        console.log('User document does not exist.');
        // Handle the case when the user document does not exist
      }
    } catch (error) {
      console.error('Error fetching total points:', error);
      console.error('Error fetching current user:', error);
    }
  }

  async getDownloadUrl(part: string, imageName: string): Promise<string> {
    const imagePath = `PetDefault/${part}/${imageName}`;
    const storageRef = this.storage.ref(imagePath);
    return storageRef.getDownloadURL().toPromise();
  }

  // Method to save data to Firestore
  async save() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      const userId = currentUser.uid;

      // Update or add data to the document
      await this.firestore.collection('users').doc(userId).update({
        petEyesUrl: this.petEyesUrl,
        petMouthUrl: this.petMouthUrl,
        petBodyUrl: this.petBodyUrl,
        // petHatUrl: this.petHatUrl,
        // Add other properties as needed
      });

      // Log the name and URL of the selected pet body when saved
      console.log('Data saved successfully!', this.petBodyUrl);
      await this.showPetBodySavedPopup();

      // Log the name and URL of the selected pet body when saved
      console.log(
        `Saved Pet Body: ${this.getSelectedPetBodyName()}, URL: ${
          this.petBodyUrl
        }`
      );

      // console.log(`Saved Pet Hat URL: ${this.petHatUrl}`);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async showPetBodySavedPopup() {
    const alert = await this.alertController.create({
      header: 'Pet Body Saved',
      message: 'Pet body saved successfully!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  getSelectedPetBodyName(): string {
    // Assuming the pet body URL is in the format 'PetDefault/Body/{PetBodyName}.png'
    const petBodyUrlParts = this.petBodyUrl.split('/');

    // Extract the pet body name from the URL
    const petBodyName = petBodyUrlParts[petBodyUrlParts.length - 1].replace(
      '.png',
      ''
    );

    return petBodyName;
  }

  async equipPetBody(petBodyUrl: string, petName: string) {
    // Update the selected pet body URL in the service
    this.petBodyService.setSelectedPetBodyUrl(petBodyUrl);

    // Update the pet body in the container
    this.petBodyUrl = petBodyUrl;

    // Log the name and URL of the selected pet body
    console.log(`Selected Pet Body: ${petName}, URL: ${petBodyUrl}`);
  }

  //buy body
  async buyPetBody(petName: string, price: number) {
    const loading = await this.loadingController.create({
      message: 'Processing...',
      spinner: 'circles', // Choose a spinner type
      translucent: true,
      backdropDismiss: false, // Prevent dismissing by tapping the backdrop
    });
    await loading.present();

    try {
      // Check if the user has enough points to buy the pet body
      if (this.totalPoints >= price) {
        // Deduct the price from the user's total points
        this.totalPoints -= price;

        // Update the ownership status
        switch (petName) {
          case 'Duzzy':
            this.isDuzzyOwned = true;
            break;
          case 'BigYak':
            this.isBigYakOwned = true;
            break;
          case 'Curly':
            this.isCurlyOwned = true;
            break;
          case 'Spikey':
            this.isSpikeyOwned = true;
            break;
          case 'Sumo':
            this.isSumoOwned = true;
            break;
          case 'wetDog':
            this.isWetDogOwned = true;
            break;
          // Add similar cases for other pet bodies if needed
        }

        // Save the updated total points and owned pet bodies to Firestore or another source
        await this.updateUserData();

        // Notify the user that the purchase was successful
        this.presentAlert(
          `Successfully purchased ${petName} for ${price} Points.`
        );
      } else {
        // Notify the user that they don't have enough points
        this.presentAlert(`Not enough Points to buy ${petName}.`);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async updateUserData() {
    try {
      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        await this.firestore.collection('users').doc(userId).set(
          {
            totalPoints: this.totalPoints,
            ownedPetBodies: this.getOwnedPetBodies(),
            // ownedCosmetics: this.getOwnedCosmetics(),
            petBodyUrl: this.petBodyUrl,
          },
          { merge: true }
        );
        console.log('User data updated successfully.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }

  async fetchOwnedPetBodies(userId: string): Promise<string[]> {
    try {
      const userDoc = await this.firestore
        .collection('users')
        .doc(userId)
        .get()
        .toPromise();
      return userDoc.get('ownedPetBodies') || [];
    } catch (error) {
      console.error('Error fetching owned pet bodies:', error);
      return [];
    }
  }

  // Helper method to get the list of owned pet bodies based on the ownership flags
  private getOwnedPetBodies(): string[] {
    const ownedPetBodies: string[] = [];
    if (this.isDuzzyOwned) {
      ownedPetBodies.push('Duzzy');
    }

    if (this.isBigYakOwned) {
      ownedPetBodies.push('BigYak');
    }

    if (this.isCurlyOwned) {
      ownedPetBodies.push('Curly');
    }

    if (this.isSpikeyOwned) {
      ownedPetBodies.push('Spikey');
    }

    if (this.isSumoOwned) {
      ownedPetBodies.push('Sumo');
    }

    if (this.isWetDogOwned) {
      ownedPetBodies.push('wetDog');
    }
    // Add similar conditions for other pet bodies if needed
    return ownedPetBodies;
  }

  nextCategory(category: string) {
    this.currentCategory = category;
  }

  // Method to switch to the previous category
  previousCategory(category: string) {
    this.currentCategory = category;
  }

  //Cosmetics

  async fetchUserData(userId: string) {
    const userDoc = await this.firestore
      .collection('users')
      .doc(userId)
      .get()
      .toPromise();
    const userData = userDoc.data() as {
      ownedCosmetics: string[];
      petHatUrl?: string; // Add petHatUrl property to userData type
    };

    // Check if user owns the wizard hat
    if (userData && userData.ownedCosmetics) {
      this.isWizardHatOwned = userData.ownedCosmetics.includes('wizardHat');
      this.isSantaHatOwned = userData.ownedCosmetics.includes('santaHat');
    }

    // this.petHatUrl = userData.petHatUrl || null;
  }

  async buyHat(hatName: string, price: number) {
    try {
      // Check if the user has enough points to buy the hat
      if (this.totalPoints >= price) {
        // Deduct the price from the user's total points
        this.totalPoints -= price;
        // Update ownership status for the hat
        switch (hatName) {
          case 'wizardHat':
            this.isWizardHatOwned = true;
            break;
          case 'santaHat':
            this.isSantaHatOwned = true;
            break;
          // Add cases for other hats as needed
        }
        // Save updated user data to Firestore
        await this.updateUserData();
        // Notify the user that the purchase was successful
        await this.presentAlert(
          `Successfully purchased ${hatName} for ${price} Points.`
        );
      } else {
        // Notify the user that they don't have enough points
        await this.presentAlert(`Not enough Points to buy ${hatName}.`);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
    }
  }

  // async equipWizardHat() {
  //   try {
  //     this.equippedHat = 'wizardHat';
  //     this.isWizardHatEquipped = true;
  //     this.petHatUrl = this.wizardPurpleUrl;
  //     await this.updateUserData();
  //     // Store the equipped hat in local storage
  //     localStorage.setItem('equippedHat', 'wizardHat');
  //   } catch (error) {
  //     console.error('Error equipping Wizard Hat:', error);
  //   }
  // }

  // async equipSantaHat() {
  //   try {
  //     this.equippedHat = 'santaHat';
  //     this.isSantaHatEquipped = true;
  //     // this.petHatUrl = this.santaUrl;
  //     await this.updateUserData();
  //     // Store the equipped hat in local storage
  //     localStorage.setItem('equippedHat', 'santaHat');
  //   } catch (error) {
  //     console.error('Error equipping Santa Hat:', error);
  //   }
  // }
  // getOwnedCosmetics(): string[] {
  //   const ownedCosmetics: string[] = [];
  //   if (this.isWizardHatOwned) {
  //     ownedCosmetics.push('wizardHat');
  //   }
  //   if (this.isSantaHatOwned) {
  //     ownedCosmetics.push('santaHat');
  //   }
  //   // Add similar conditions for other cosmetics if needed
  //   return ownedCosmetics;
  // }
}
