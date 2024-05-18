import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  selectedTime: string | null = null;
  selectedDate: string | null = null;
  selectedDoctorFullname: string | null = null;


  constructor(
    private firestore: AngularFirestore
  ) { }

  scheduleAppointment(time: string, date: string, doctorFullName: string) {
    // Add logic to handle scheduling
    console.log('Appointment scheduled for:', date, time, 'with', doctorFullName);
    this.selectedTime = time;
    this.selectedDate = date;
    this.selectedDoctorFullname = doctorFullName;
  }



}
