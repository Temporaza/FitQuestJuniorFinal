import { Component, Input, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-open-task-done-modal',
  templateUrl: './open-task-done-modal.page.html',
  styleUrls: ['./open-task-done-modal.page.scss'],
})
export class OpenTaskDoneModalPage implements OnInit {
  @Input() userData: any;
  @Input() usersUID: string;
  @Input() confirmedTasks: any[]; // Add this line
  tasks$: Observable<any[]>;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private alertControler: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    console.log('usersUID in modal:', this.usersUID);
    this.loadTasks();
  }

  loadTasks() {
    // Fetch tasks for the specific user using the usersUID
    this.tasks$ = this.firestore
      .collection(`users/${this.usersUID}/tasks`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );

    this.tasks$.subscribe((tasks) => {
      console.log('Tasks for the user:', tasks);
    });
  }
  dismiss() {
    this.playButtonClickSound();
    this.modalController.dismiss();
  }

  async deleteTask(task: any) {
    this.playButtonClickSound();
    const alert = await this.alertControler.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            const loading = await this.presentLoading();
            try {
              // Delete the task from Firestore
              await this.firestore
                .collection('users')
                .doc(task.userId)
                .collection('tasks')
                .doc(task.id)
                .delete();
              await this.firestore
                .collection('parents')
                .doc(task.parentId)
                .collection('tasks')
                .doc(task.id)
                .delete();

              await loading.dismiss();

              // Show a success toast message
              await this.presentSuccessMessage('Task deleted successfully.');
            } catch (error) {
              console.error('Error deleting task:', error);
              // Show an error toast message
              await this.presentErrorMessage('Error deleting task.');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  private async presentSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Deleting task...',
      duration: 5000, // Optional: Set a maximum duration for the loading spinner
    });
    await loading.present();
    return loading; // Return the loading instance to dismiss it later
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }
}
