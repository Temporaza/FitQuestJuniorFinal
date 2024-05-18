import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocAppointmentService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AngularFireAuth
  ) { }

   // Adjust the method to accept a doctorUID parameter
   getDoctorAppointments(doctorUID: string): Observable<any[]> {
    console.log('Doctor UID in getDoctorAppointments:', doctorUID);
    
    const appointmentsCollection = this.firestore.collection(`doctors/${doctorUID}/appointments`);
    return appointmentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  updateAppointmentStatus(appointmentId: string, newStatus: string): Promise<void> {
    // Get the UID of the authenticated user (doctor)
    return this.authService.authState.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          const doctorUID = user.uid;

          // Use the doctor's UID to build the correct document reference
          const appointmentDocRef = this.firestore.collection('doctors').doc(doctorUID)
            .collection('appointments').doc(appointmentId);

          return appointmentDocRef.get().toPromise().then(doc => {
            if (doc.exists) {
              // Document exists, update the status
              return appointmentDocRef.update({ status: newStatus });
            } else {
              // Document doesn't exist, handle accordingly (log, show an error, etc.)
              console.error('Error updating appointment: Document not found');
              throw new Error('Document not found');
            }
          });
        } else {
          // Handle the case where the user is not authenticated
          console.error('Error updating appointment: User not authenticated');
          throw new Error('User not authenticated');
        }
      })
    ).toPromise();
  }

  
}
