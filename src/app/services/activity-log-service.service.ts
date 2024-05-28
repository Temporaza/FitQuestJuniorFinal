import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogServiceService {
  constructor(private firestore: AngularFirestore) {}

  // Fetch the activity logs from Firestore
  // Fetch the activity logs from Firestore
  getActivityLogs(userId: string): Observable<any[]> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection('activityLogs', (ref) => ref.orderBy('loginTime', 'desc'))
      .valueChanges();
  }

  // Save a new activity log to Firestore
  saveActivityLog(userId: string, log: any) {
    const logId = this.firestore.createId();
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection('activityLogs')
      .doc(logId)
      .set(log);
  }

  // Save user activity data to Firestore
  saveUserActivity(userId: string, data: any) {
    return this.firestore.collection('users').doc(userId).update(data);
  }
}
