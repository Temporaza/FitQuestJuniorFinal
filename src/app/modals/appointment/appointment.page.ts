import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthenticationForParentsService } from 'src/app/authenticationParents/authentication-for-parents.service';
import { AppointmentService } from 'src/app/services/appointment.service';



@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {
   // Fetch the opening and closing time from the AppointmentService or other source
   @Input() doctor: any; // Input property to receive the matched doctor data
   @Input() doctorFullName: string; 
   @Input() doctorUID: string;
   private parentFullName: string;
   availableTimeSlots: { startTime: string, endTime: string }[] = []; // Define the array

  constructor(
    private appointmentService: AppointmentService,
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authenticationForParentsService: AuthenticationForParentsService,
 
  ) { }

  ngOnInit() {
    console.log('Doctor Data:', this.doctor);
    console.log('Doctor Full Name:', this.doctorFullName);

     // Fetch parentFullName
     this.auth.authState.subscribe(user => {
      if (user && user.displayName) {
        this.parentFullName = user.displayName;
        console.log('Parent Full Name:', this.parentFullName);
      }
    });
  }
  
  async ionViewWillEnter() {
    console.log('ionViewWillEnter triggered');
    if (this.doctor) {
      await this.populateAvailableTimeSlots();
    }
  }

  async selectTime(timeRange: any) {
    const loading = await this.presentLoading();
  
    try {
      const selectedDate = this.doctor?.preferredDayFormatted;
      const selectedTime = timeRange.startTime;
      const parentUID = (await this.auth.currentUser)?.uid;
  
      if (this.doctor && this.doctorFullName !== undefined && parentUID) {
        // Fetch the parent's full name
        const parentData = await this.authenticationForParentsService.getUserDataByUid(parentUID);
        const parentFullName = parentData?.fullname;
  
        if (parentFullName) {
          const doctorsCollection = this.firestore.collection('doctors');
          const querySnapshot = await doctorsCollection.ref
            .where('fullname', '==', this.doctorFullName)
            .get();
  
          if (!querySnapshot.empty) {
            const doctorUID = querySnapshot.docs[0].id;
  
            // Use the parent UID as part of the documentId for common reference
            const commonDocumentId = `${parentUID}_${this.firestore.createId()}`;
  
            const appointmentData = {
              date: selectedDate,
              time: selectedTime,
              parentUID: parentUID,
              parentFullName: parentFullName, // Include parent's full name
              doctorFullName: this.doctorFullName,
              doctorUID: doctorUID,
              status: 'Pending',
            };
  
            const doctorRef = this.firestore.collection('doctors').doc(doctorUID);
            const appointmentsSubcollectionRef = doctorRef.collection('appointments');
  
            // Use the common document ID here
            await appointmentsSubcollectionRef.doc(commonDocumentId).set(appointmentData);
            console.log('Appointment added to doctor\'s appointments subcollection with ID:', commonDocumentId);
  
            const parentAppointmentsRef = this.firestore.collection('parents').doc(parentUID).collection('appointments');
  
            // Use the common document ID here
            await parentAppointmentsRef.doc(commonDocumentId).set(appointmentData);
            console.log('Appointment added to parent\'s appointments subcollection with ID:', commonDocumentId);
  
            this.dismissModal();
            this.presentSuccessMessage();
          } else {
            console.error('No doctor found with the specified full name:', this.doctorFullName);
            this.presentErrorMessage('No doctor found with the specified full name');
          }
        } else {
          console.error('Parent full name is undefined.');
          this.presentErrorMessage('Parent full name is undefined');
        }
      } else {
        console.error('Doctor, doctor full name, or parent full name is undefined.');
        console.log('Doctor:', this.doctor);
        console.log('Doctor Full Name:', this.doctorFullName);
        console.log('Parent UID:', parentUID);
        this.presentErrorMessage('Doctor, doctor full name, or parent full name is undefined');
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      this.presentErrorMessage('Error adding appointment');
    } finally {
      loading.dismiss();
    }
  }
  
  dismissModal() {
    this.modalController.dismiss();
  }

  private async populateAvailableTimeSlots() {
    const openingTime: string = this.doctor.preferredDayAvailability?.openingTime;
    const closingTime: string = this.doctor.preferredDayAvailability?.closingTime;
  
    if (openingTime && closingTime) {
      const intervalMinutes = 30;
      const currentTime = new Date(`2000-01-01T${openingTime}`);
      const closingTimeDate = new Date(`2000-01-01T${closingTime}`);
  
      // console.log('Current Time (Initial):', currentTime);
      // console.log('Closing Time (Expected):', closingTimeDate);
  
      this.availableTimeSlots = [];
  
      while (currentTime < closingTimeDate) {
        const formattedStartTime = this.formatTime(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        const formattedEndTime = this.formatTime(currentTime);
      
        const timeRange = { startTime: formattedStartTime, endTime: formattedEndTime };
        this.availableTimeSlots.push(timeRange);
      
        // console.log('Time Range:', timeRange);
      }
  
      // console.log('Populated Time Slots:', this.availableTimeSlots);
    } else {
      console.error('Invalid opening or closing time.');
    }
  }
  
   // Helper function to format time
   private formatTime(date: Date): string {
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // console.log('Formatted Time:', formattedTime);
    return formattedTime;
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'circles',
      translucent: true,
      backdropDismiss: false,
    });
    await loading.present();
    return loading;
  }

  private async presentSuccessMessage() {
    const toast = await this.toastController.create({
      message: 'Appointment scheduled successfully.',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    await toast.present();
  }

  private async presentErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message: `Error: ${message}`,
      duration: 2000,
      position: 'top',
      color: 'danger',
    });
    await toast.present();
  }
}
