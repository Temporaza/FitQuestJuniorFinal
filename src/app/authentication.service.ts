import { Injectable } from '@angular/core';
// import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    public ngFireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  async isAuthenticated(): Promise<boolean> {
    const user = await this.ngFireAuth.currentUser;
    return !!user;
  }

  async registerUser(
    email: string,
    password: string,
    fullname: string,
    age: number,
    birthday: string,
    petName: string,
    parentEmail?: string
  ) {
    // return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
    try {
      const userCredential =
        await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userData = {
        email: user.email,
        fullname: fullname,
        role: 'user',
        usersUID: user.uid,
        age: age,
        birthday: birthday,
        petName: petName,
        petHealth: 100,
      };

      await this.addUserDataToFirestore(user.uid, userData);

      // If a parent email is provided, link the user to the parent
      if (parentEmail) {
        const parentUID = await this.getParentUIDByEmail(parentEmail);
        if (parentUID) {
          await this.saveUserToParent(parentUID, user);
        }
      }

      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async getParentUIDByEmail(parentEmail: string): Promise<string | null> {
    try {
      const snapshot = await this.firestore
        .collection('parents', (ref) => ref.where('email', '==', parentEmail))
        .get()
        .toPromise();
      if (!snapshot.empty) {
        return snapshot.docs[0].id;
      }
      return null;
    } catch (error) {
      console.error('Error getting parent UID by email:', error);
      throw error;
    }
  }

  async saveUserToParent(parentUID: string, user: any) {
    try {
      const parentDocRef = this.firestore.collection('parents').doc(parentUID);

      // Get the current users array
      const parentDoc = await parentDocRef.get().toPromise();
      const parentData = parentDoc.data() as { users?: string[] }; // Explicitly cast to a known type

      // Check if user.uid is not already in the array
      const usersArray: string[] = parentData.users || [];

      if (!usersArray.includes(user.uid)) {
        // Add user.uid to the array
        usersArray.push(user.uid);

        // Update the document with the modified array
        await parentDocRef.update({ users: usersArray });
      }
    } catch (error) {
      console.error('Error updating parent document:', error);
      throw error;
    }
  }

  //Add data to the firestore
  private async addUserDataToFirestore(userId: string, userData: any) {
    try {
      const userRef = this.firestore.collection('users').doc(userId);
      await userRef.set(userData);
    } catch (error) {
      console.error('Error adding user data to Firestore:', error);
      throw error;
    }
  }

  //check doctor's role
  async checkUserRole(userId: string): Promise<string | null> {
    const userDoc = await this.firestore
      .collection('users')
      .doc(userId)
      .get()
      .toPromise();

    if (userDoc.exists) {
      return 'user';
    }
    const parentDoc = await this.firestore
      .collection('parents')
      .doc(userId)
      .get()
      .toPromise();
    if (parentDoc.exists) {
      return 'parent';
    }

    return null; // User does not exist in either role
  }

  async loginUser(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  async resetPassword(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);
  }

  async signOut() {
    return await this.ngFireAuth.signOut();
  }

  async getProfile() {
    return await this.ngFireAuth.currentUser;
  }

  //fetching the fullname and display
  async getUserDataByUid(uid: string) {
    try {
      const userDoc = await this.firestore
        .collection('users')
        .doc(uid)
        .get()
        .toPromise();
      if (userDoc.exists) {
        return userDoc.data();
      } else {
        throw new Error('User data not found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.ngFireAuth.currentUser;
      if (user) {
        return user;
      } else {
        throw new Error('User not found.');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  async checkUserIdExists(userId: string): Promise<boolean> {
    try {
      const userDoc = await this.firestore
        .collection('users')
        .doc(userId)
        .get()
        .toPromise();
      return userDoc.exists;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      throw error;
    }
  }
}
