import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs/operators';
import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { TaskStatusService } from 'src/app/services/task-status.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-kids-progress',
  templateUrl: './kids-progress.page.html',
  styleUrls: ['./kids-progress.page.scss'],
})
export class KidsProgressPage implements OnInit {
  tasks$: Observable<any>;
  isLoading = false;
  parentUID: string;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private taskStatusService: TaskStatusService,
    private location: Location,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  navigateToDashboard() {
    this.navCtrl.navigateForward('/home-parent', { animated: false });
    this.playButtonClickSound();
  }

  async loadTasks() {
    const loading = await this.loadingController.create({
      message: 'Loading Tasks...',
      duration: 5000,
    });

    try {
      await loading.present();

      this.tasks$ = this.afAuth.authState.pipe(
        switchMap((user) => {
          if (user) {
            return this.firestore
              .collection('parents')
              .doc(user.uid)
              .collection('tasks', (ref) =>
                ref.where('status', '==', 'Waiting')
              )
              .snapshotChanges()
              .pipe(
                map((actions) => {
                  return actions.map((a) => {
                    const data = a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                }),
                switchMap((taskObservables) =>
                  combineLatest(
                    taskObservables.map((task) =>
                      this.firestore
                        .collection('parents')
                        .doc(task.parentId)
                        .collection('tasks')
                        .doc(task.id)
                        .valueChanges()
                        .pipe(
                          map((parentTask: any) => {
                            return {
                              ...task,
                              points: parentTask.points,
                              additionalTasks: parentTask.additionalTasks,
                            };
                          })
                        )
                    )
                  )
                )
              );
          } else {
            return [];
          }
        })
      );
      await loading.dismiss();
    } catch (error) {
      console.error('Error loading tasks:', error);
      await loading.dismiss();
    }
  }

  async confirmTaskCompletion(task: any) {
    this.playButtonClickSound();
    let loading: HTMLIonLoadingElement; // Declare the loading variable
    console.log(`Confirming task completion. Task: ${JSON.stringify(task)}`);

    try {
      loading = await this.loadingController.create({
        message: 'Confirming task completion...',
      });

      await loading.present();

      // Implement the logic for confirming a task completion
      task.status = 'Completed';
      task.confirmed = true; // Set the confirmed field to true

      console.log(`Task status set to 'Completed'. Updating Firestore...`);

      // Update the status and confirmation in Firestore for 'parents' collection
      await this.firestore
        .collection('parents')
        .doc(task.parentId)
        .collection('tasks')
        .doc(task.id)
        .update({
          status: task.status,
          confirmed: task.confirmed,
        });

      // Update the status and confirmation in Firestore for 'users' collection
      await this.firestore
        .collection('users')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.id)
        .update({
          status: task.status,
          confirmed: task.confirmed,
        });

      // Fetch the points for the task
      this.firestore
        .collection('users')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.id)
        .get()
        .subscribe(async (doc) => {
          const taskData = doc.data();
          const taskPoints = taskData ? taskData['points'] : 0;

          console.log(`Task points: ${taskPoints}`);
          // Notify the task service about the status change
          this.taskStatusService.setTaskStatus(
            task.status,
            taskPoints,
            task.userId,
            task.otherTasks,
            task.additionalTasks,
            true
          );

          // Fetch the current total points from Firestore
          const currentTotalPoints =
            await this.taskStatusService.getTotalPointsFromFirestore(
              task.userId
            );
          console.log(
            `Current total points at Firestore: ${currentTotalPoints}`
          );
        });
    } catch (error) {
      console.error('Error confirming task completion:', error);
    } finally {
      // Dismiss the loading indicator
      if (loading) {
        await loading.dismiss();
      }
    }
  }
  //add true

  async deleteTask(task: any) {
    // Implement the logic for deleting a task
    const alert = await this.alertController.create({
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
            // Delete the task from Firestore
            await this.firestore
              .collection('parents')
              .doc(this.parentUID)
              .collection('tasks')
              .doc(task.id)
              .delete();
          },
        },
      ],
    });

    await alert.present();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.location.forward();
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }
}
