import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { TaskStatusService } from 'src/app/services/task-status.service';
import { Subscription } from 'rxjs';
import { CustomNavigationPage } from 'src/app/component/custom-navigation/custom-navigation.page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-parents-acitvity',
  templateUrl: './parents-acitvity.page.html',
  styleUrls: ['./parents-acitvity.page.scss'],
})
export class ParentsAcitvityPage implements OnInit {
  userEmail: string = ''; // Variable to store the kid's email
  taskDetails: string = '';
  points: string = '50';
  createdActivities$: Observable<any[]>;
  tasks$: Observable<any>;
  taskStatus: string;
  usersData: any[] = [];
  selectedUserId: string;
  userStatus: string;

  selectedExercise: string = '';
  otherTasks: string = '';

  authSubscription: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private taskStatusService: TaskStatusService,
    private location: Location
  ) {}

  ngOnInit() {
    this.authSubscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.loadUsers();
        this.taskStatusService.getTaskStatus().subscribe((statusWithPoints) => {
          const { status, points } = statusWithPoints;
          this.taskStatus = status;
          this.loadTasks();
        });
      } else {
        console.error('No user is logged in.');
        // Handle case where no user is logged in, such as redirecting to login page
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getExercisesForStatus(userStatus: string): string[] {
    switch (userStatus) {
      case 'Underweight':
        return [
          'Jumping Jacks',
          'Climbing Stairs',
          'Hula Hooping',
          'Chair Squats',
          'Stretching',
          'dance',
        ];
      case 'Healthy Weight':
        return [
          'Running',
          'Jump Rope',
          'Dance Routines',
          'Arm Circles',
          'Squats',
        ];
      case 'Overweight':
        return [
          'Brisk Walking',
          'Hula Hooping',
          'Balancing Exercise One Leg',
          'Neck Stretch',
          'Leg Stretch',
        ];
      case 'Obesity':
        return [
          'Chair Exercise',
          'Run',
          'Bunny Hops',
          'Gentle Yoga',
          'Walking',
          'Balance Exercise',
        ];
      // Add more cases for different statuses
      default:
        return [];
    }
  }

  onExerciseSelected(exercise: string) {
    console.log('Selected Exercise:', exercise);
    // You can add any logic related to the selected exercise here
  }

  async loadTasks() {
    const loading = await this.showLoading('Loading Tasks...');

    try {
      await loading.present();

      this.tasks$ = this.afAuth.authState.pipe(
        switchMap((user) => {
          if (user) {
            return this.firestore
              .collection('parents')
              .doc(user.uid)
              .collection('tasks')
              .snapshotChanges()
              .pipe(
                map((actions) => {
                  return actions.map((a) => {
                    const data = a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    const userId = data.userId;

                    // Fetch user details from the 'users' collection
                    return this.firestore
                      .collection('users')
                      .doc(userId)
                      .snapshotChanges()
                      .pipe(
                        switchMap((userAction) => {
                          const userData = userAction.payload.data() as any;
                          const userEmail = userData.email;

                          // Load user status and add it to the task data
                          return this.loadUserStatus(userId).pipe(
                            switchMap((userStatus) => {
                              // Dynamically fetch exercises based on user's status
                              const exercises =
                                this.getExercisesForStatus(userStatus);

                              return of({
                                ...data,
                                id,
                                userEmail,
                                userStatus,
                                exercises,
                              });
                            })
                          );
                        })
                      );
                  });
                }),
                switchMap((taskObservables) => combineLatest(taskObservables))
              );
          } else {
            return [];
          }
        })
      );
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.showErrorAlert('Error loading tasks. Please try again.');
    } finally {
      await loading.dismiss();
    }
  }

  // Function to load and display the user status
  loadUserStatus(userId: string): Observable<string> {
    // console.log('Loading status for userId:', userId);
    return this.firestore
      .collection('users')
      .doc(userId)
      .valueChanges()
      .pipe(
        tap((userData: any) => console.log('User Data:', userData)),
        switchMap((userData: any) => {
          if (userData) {
            return of(userData?.status || 'N/A');
          } else {
            console.error('User document not found for userId:', userId);
            return of('N/A');
          }
        }),
        catchError((error) => {
          console.error('Error loading user status:', error);
          return of('N/A');
        })
      );
  }

  // Function to handle user selection
  onUserSelected(userId: string) {
    this.selectedUserId = userId;

    // Log the selected user's UID
    console.log('Selected User UID:', userId);

    // Load and display the user status
    this.loadUserStatus(userId).subscribe((userStatus) => {
      this.userStatus = userStatus;
    });
  }

  async createTask() {
    const loading = await this.showLoading('Creating Task...');

    try {
      await loading.present();

      if (!this.selectedUserId) {
        console.error('No user selected.');
        return;
      }

      if (!this.selectedUserId || !this.selectedExercise || !this.points) {
        this.showErrorAlert('Please fill in all required fields.');
        return;
      }

      const selectedUser = this.usersData.find(
        (user) => user.id === this.selectedUserId
      );

      if (!selectedUser) {
        console.error('Selected user not found.');
        return;
      }

      const userId = selectedUser.id;

      const currentUser = this.afAuth.currentUser;
      if (currentUser) {
        const parentId = (await currentUser).uid;

        const task = {
          userId: userId,
          parentId: parentId,
          description: this.selectedExercise,
          otherTasks: this.otherTasks,
          status: 'pending',
          points: parseInt(this.points, 10),
          timestamp: new Date(),
          confirmed: false,
        };

        const parentTaskRef = await this.firestore
          .collection('parents')
          .doc(parentId)
          .collection('tasks')
          .add(task);

        // Get the generated task ID
        const taskId = parentTaskRef.id;

        // Add the task to the corresponding user's collection with the assigned UID and points
        await this.firestore
          .collection('users')
          .doc(userId)
          .collection('tasks')
          .doc(taskId)
          .set({
            ...task,
            points: parseInt(this.points, 10),
          });

        this.taskDetails = '';
        this.points = '50';
        this.otherTasks = '';
      } else {
        console.error('User not logged in.');
      }

      this.showSuccessAlert('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      this.showErrorAlert('Error creating task. Please try again.');
    } finally {
      // Dismiss the loading indicator regardless of success or failure
      await loading.dismiss();
    }
  }

  editTask(task: any) {
    // Implement the logic for editing a task
    console.log('Editing task:', task);
    // Add your editing logic, e.g., opening a modal or navigating to an edit page
  }

  async deleteTask(task: any) {
    // Implement the logic for deleting a task
    const currentUser = this.afAuth.currentUser;
    if (currentUser) {
      const parentId = (await currentUser).uid;
      this.firestore
        .collection('parents')
        .doc(parentId)
        .collection('tasks')
        .doc(task.id)
        .delete();
    }
    console.log('Deleting task:', task);
    // Add your deletion logic, e.g., showing a confirmation dialog or making an API call
  }

  private async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      duration: 5000,
    });
    await loading.present();
    return loading;
  }

  private async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async loadUsers() {
    const loading = await this.showLoading('Loading Users...');

    try {
      await loading.present();

      const currentUser = this.afAuth.currentUser;
      if (currentUser) {
        const parentId = (await currentUser).uid;

        this.firestore
          .collection('parents')
          .doc(parentId)
          .collection('users')
          .snapshotChanges()
          .pipe(
            map((actions) => {
              return actions.map((a) => {
                const userData = a.payload.doc.data() as any;
                const id = a.payload.doc.id; // This should be the UID, not email
                return { ...userData, id };
              });
            })
          )
          .subscribe((users) => {
            this.usersData = users;
          });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.showErrorAlert('Error loading users. Please try again.');
    } finally {
      await loading.dismiss();
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.location.forward();
  }
}
