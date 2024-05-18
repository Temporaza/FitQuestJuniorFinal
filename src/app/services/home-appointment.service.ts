import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeAppointmentService {
  private appointmentData = new BehaviorSubject<any>(null);
  currentAppointmentData = this.appointmentData.asObservable();

  constructor(private storage: Storage) {} // Add this constructor

  async updateAppointmentData(data: any) {
    this.appointmentData.next(data);
    await this.storage['set']('appointmentData', data); // Save data to storage
  }

  async getStoredAppointmentData() {
    return await this.storage['get']('appointmentData'); // Retrieve data from storage
  }
}
