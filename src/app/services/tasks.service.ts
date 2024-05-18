import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getTasks(userUid: string): Observable<any[]> {
    console.log('Fetching tasks for userUid:', userUid);
    return this.firestore.collection('tasks', ref => ref.where('userUid', '==', userUid)).valueChanges();
  }
}
