import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  LoadingController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { TaskStatusService } from 'src/app/services/task-status.service';
import { ExerciseExplanationPage } from 'src/app/modals/exercise-explanation/exercise-explanation.page';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
  userTasks$: Observable<any>;
  isLoading = false;
  taskStatus: string;
  filteredTasks: any[] = [];
  taskStatus$: Observable<string>;
  isOngoingTasksSelected = true;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private taskStatusService: TaskStatusService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.taskStatusService.getTaskStatus().subscribe((statusWithPoints) => {
      const { status, points } = statusWithPoints;

      // Now you can use both status and points
      this.taskStatus = status;
      // You might also want to use points here if needed

      // Continue with the rest of your code...
      this.loadUserTasks();
    });
  }

  async openExerciseExplanationModal(task: any) {
    const modal = await this.modalController.create({
      component: ExerciseExplanationPage,
      componentProps: {
        task: task,
        selectedExercise: task.description,
      },
    });
    return await modal.present();
  }

  async loadUserTasks() {
    const currentUser = await this.afAuth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;

      this.userTasks$ = this.firestore
        .collection('users')
        .doc(userId)
        .collection('tasks')
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

      this.userTasks$.subscribe((tasks) => {
        this.filteredTasks = tasks;
        this.isLoading = false;
      });
    }
  }

  showOngoingTasks() {
    this.isOngoingTasksSelected = true;
    this.userTasks$.subscribe((tasks) => {
      this.filteredTasks = tasks.filter(
        (task) => task.status === 'Pending' || task.status === 'Waiting'
      );
    });
  }

  showCompletedTasks() {
    this.isOngoingTasksSelected = false;
    this.userTasks$.subscribe((tasks) => {
      this.filteredTasks = tasks.filter((task) => task.status === 'Completed');
    });
  }

  async updateTaskStatus(task: any) {
    task.status = 'Waiting';

    const currentUser = await this.afAuth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      const parentId = task.parentId;

      this.firestore
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(task.id)
        .update({ status: task.status });

      this.firestore
        .collection('parents')
        .doc(parentId)
        .collection('tasks')
        .doc(task.id)
        .update({ status: task.status });

      this.taskStatusService.setTaskStatus(
        task.status,
        task.points,
        userId,
        task.otherTasks,
        false
      );
    }
  }

  async deleteTask(task: any) {
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
            // Delete the task from Firestore in the 'users' collection
            const currentUser = this.afAuth.currentUser;
            if (currentUser) {
              const userId = (await currentUser).uid;
              await this.firestore
                .collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(task.id)
                .delete();
            }

            // Delete the task from Firestore in the 'parents' collection
            const parentId = task.parentId; // Make sure you have the parentId stored in the task
            if (parentId) {
              await this.firestore
                .collection('parents')
                .doc(parentId)
                .collection('tasks')
                .doc(task.id)
                .delete();
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
