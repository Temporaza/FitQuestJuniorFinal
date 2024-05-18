import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';

interface ParentData {
  fullname: string;
  profile?: string;
}

interface User {
  fullname: string;
  // Add other properties if needed
}

@Component({
  selector: 'app-parents-profile-page',
  templateUrl: './parents-profile-page.page.html',
  styleUrls: ['./parents-profile-page.page.scss'],
})
export class ParentsProfilePagePage implements OnInit {
  @ViewChild('previewImage') previewImage: ElementRef;
  @Input() currentUser: any;
  isEditMode: boolean = false;
  originalCurrentUser: any;
  parentUID: string | null = null;
  fullnameSubscription: any;
  selectedImage: any;
  selectedFile: File | null = null;
  profileImageUrl: string | null = null;
  parentUsers: any[];

  constructor(
    private modalController: ModalController,
    private authService: AuthenticationForParentsService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private afStorage: AngularFireStorage
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.authService.getAuthenticatedParentInfo();
      if (!this.currentUser) {
        console.error('Current parent information is undefined.');
        return;
      }
      console.log('Current parent login:', this.currentUser);

      // Fetch the parent UID from AngularFireAuth
      const user = await this.afAuth.currentUser;
      if (user) {
        this.parentUID = user.uid;
        console.log('Parent UID:', this.parentUID);

        // Fetch the document data from Firestore
        const doc = await this.firestore
          .collection('parents')
          .doc(this.parentUID)
          .get()
          .toPromise();
        if (doc.exists) {
          // Cast the data to the defined interface
          const data = doc.data() as ParentData;
          if (data && data.profile) {
            this.profileImageUrl = data.profile;
          }
        }

        // Subscribe to changes in the fullname field
        this.fullnameSubscription = this.firestore
          .collection('parents')
          .doc(this.parentUID)
          .valueChanges()
          .subscribe((data: any) => {
            this.currentUser.fullname = data.fullname;
          });

        const usersSnapshot = await this.firestore
          .collection('parents')
          .doc(this.parentUID)
          .collection('users')
          .get()
          .toPromise();

        // Map users data to parentUsers array
        this.parentUsers = usersSnapshot.docs.map((doc) => doc.data());

        // Log parentUsers array
        console.log('Parent Users:', this.parentUsers);
      }
    } catch (error) {
      console.error('Error fetching current parent information:', error);
    }
  }

  ngOnDestroy() {
    if (this.fullnameSubscription) {
      this.fullnameSubscription.unsubscribe();
    }
  }

  dismiss() {
    this.modalController.dismiss();
    this.playButtonClickSound();
  }

  uploadProfilePicture() {
    console.log('Button Clicked!!');
  }

  toggleEditMode() {
    this.playButtonClickSound();
    if (!this.isEditMode) {
      // Store the original currentUser before entering edit mode
      this.originalCurrentUser = { ...this.currentUser };
    } else {
      // Restore the original currentUser when canceling edit mode
      this.currentUser = { ...this.originalCurrentUser };
    }
    this.isEditMode = !this.isEditMode;
  }

  async saveChanges() {
    this.playButtonClickSound();
    const loading = await this.loadingController.create({
      message: 'Saving changes...',
    });
    await loading.present();

    try {
      if (!this.parentUID) {
        throw new Error('Parent UID is undefined.');
      }

      console.log('Selected file:', this.selectedFile);

      if (this.selectedFile) {
        const filePath = `parents/${this.parentUID}/${this.selectedFile.name}`;
        const fileRef = this.afStorage.ref(filePath);
        await this.afStorage.upload(filePath, this.selectedFile);

        const downloadURL = await fileRef.getDownloadURL().toPromise();

        await this.firestore.collection('parents').doc(this.parentUID).update({
          fullname: this.currentUser.fullname,
          gender: this.currentUser.gender,
          profile: downloadURL,
        });
      } else {
        await this.firestore.collection('parents').doc(this.parentUID).update({
          fullname: this.currentUser.fullname,
          gender: this.currentUser.gender,
        });
      }

      console.log('Changes saved successfully!');
      await loading.dismiss();
      this.presentSuccessAlert();
    } catch (error) {
      console.error('Error saving changes:', error);
      await loading.dismiss();
      this.presentErrorAlert();
    }
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Changes saved successfully!',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Failed to save changes. Please try again.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  onFileSelected(event: any) {
    this.playButtonClickSound();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage.nativeElement.src = reader.result as string;
      };
      reader.readAsDataURL(file);
      console.log('Selected file to preview:', file);

      // Update selectedFile property
      this.selectedFile = file;
    }
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }
}
