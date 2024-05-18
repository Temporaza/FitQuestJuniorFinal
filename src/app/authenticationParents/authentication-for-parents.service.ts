import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationForParentsService {
  isUserAuthenticated() {
    return !!this.ngFireAuth.currentUser;
  }

  constructor(
    public ngFireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  async registerParent(
    email: string,
    password: string,
    gender: string,
    fullname: string
  ) {
    // return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
    try {
      const userCredential =
        await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userData = {
        email: user.email,
        gender: gender,
        fullname: fullname,
        role: 'parent',
      };

      await this.addUserDataToFirestore(user.uid, userData);
      this.setCurrentParentUID(user.uid);

      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
  private async addUserDataToFirestore(userId: string, userData: any) {
    try {
      const userRef = this.firestore.collection('parents').doc(userId);
      await userRef.set(userData);
    } catch (error) {
      console.error('Error adding user data to Firestore:', error);
      throw error;
    }
  }

  //check parent's role
  async checkUserRole(userId: string): Promise<string | null> {
    const userDoc = await this.firestore
      .collection('users')
      .doc(userId)
      .get()
      .toPromise();
    const parentDoc = await this.firestore
      .collection('parents')
      .doc(userId)
      .get()
      .toPromise();

    if (userDoc.exists) {
      return 'user';
    } else if (parentDoc.exists) {
      return 'parent';
    } else {
      return null; // User does not exist in either role
    }
  }

  async getUserDataByUid(uid: string): Promise<any> {
    try {
      const userDoc = await this.firestore
        .collection('parents')
        .doc(uid)
        .get()
        .toPromise();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData;
      } else {
        throw new Error('User data not found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async getCurrentParentUID(): Promise<string | null> {
    const user = await this.ngFireAuth.currentUser;
    return user ? user.uid : null;
  }

  async loginParent(email: string, password: string) {
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

  async setCurrentParentUID(uid: string) {
    localStorage.setItem('parentUID', uid);
  }

  async getAuthenticatedParentInfo(): Promise<any> {
    try {
      const uid = await this.getCurrentParentUID();
      if (uid) {
        const userData = await this.getUserDataByUid(uid);
        return userData;
      } else {
        throw new Error('No authenticated parent found.');
      }
    } catch (error) {
      console.error('Error fetching authenticated parent info:', error);
      throw error;
    }
  }

  async sendEmailVerification() {
    const user = await this.ngFireAuth.currentUser;
    if (user) {
      await user.sendEmailVerification();
    }
  }

  async sendPasswordResetEmail(email: string) {
    try {
      await this.ngFireAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
}
