import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationForDoctorsService {

  constructor(
    public ngFireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  async registerDoctor(
    email: string, 
    password:string, 
    ClinicAddress:string, 
    fullname:string,
    contact: number
    ){
    // return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
    try{
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
      const user = userCredential.user;

      const userData = {
        email: user.email,
        ClinicAddress: ClinicAddress,
        fullname: fullname,
        contact: contact,
        role: 'doctor' // Assign the 'doctor' role
      }

      await this.addDoctorDataToFirestore(user.uid, userData);

      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
      }
  }
  private async addDoctorDataToFirestore(userId: string, userData: any) {
    try {
      const userRef = this.firestore.collection('doctors').doc(userId);
      await userRef.set(userData);
    } catch (error) {
      console.error('Error adding user data to Firestore:', error);
      throw error;
    }
  }

  //check doctor's role
  async checkUserRole(userId: string): Promise<string | null> {
    const userDoc = await this.firestore.collection('users').doc(userId).get().toPromise();
    const doctorDoc = await this.firestore.collection('doctors').doc(userId).get().toPromise();
    const parentDoc = await this.firestore.collection('parents').doc(userId).get().toPromise();

    if (userDoc.exists) {
      return 'user';
    } else if (doctorDoc.exists) {
      return 'doctor';
    }else if (parentDoc.exists) {
      return 'parent';
    }else {
      return null; // User does not exist in either role
    }
  }

  isLoggedIn(): boolean {
    const user = this.ngFireAuth.currentUser;
    return user !== null;
  }

  async loginDoctor(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email,password)
  }

  async resetPassword(email:string){
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  async signOut(){
    return await this.ngFireAuth.signOut()
  }

  async getProfile(){
    return await this.ngFireAuth.currentUser
  }
 
}
