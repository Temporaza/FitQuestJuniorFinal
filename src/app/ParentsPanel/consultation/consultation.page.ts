import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
  HostListener,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Chart } from 'chart.js/auto';
import { Observable, map } from 'rxjs';
import { Location } from '@angular/common';

interface BMIRecord {
  date: string;
  bmi: number;
}

interface UserData {
  uid: string;
  fullname: string;
  bmi: number;
  bmiHistory?: BMIRecord[];
}

interface Task {
  id: string;
  description: string;
  // Add other task properties as needed
}

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.page.html',
  styleUrls: ['./consultation.page.scss'],
})
export class ConsultationPage implements OnInit, AfterViewInit {
  parentUID: string;
  usersData: any[] = [];
  tasksDone$: Observable<Task[]>;
  taskData: { description: string; count: number; percentage: number }[] = [];

  @ViewChildren('lineCanvas') lineCanvases: QueryList<ElementRef>;
  @ViewChildren('pieCanvas', { read: ElementRef })
  pieCanvases: QueryList<ElementRef>;

  userTaskDataMap: Map<
    string,
    { description: string; count: number; percentage: number }[]
  > = new Map();

  constructor(
    private firestore: AngularFirestore,
    private authFire: AngularFireAuth,
    private location: Location
  ) {}

  ngOnInit() {
    this.authFire.authState.subscribe((user) => {
      if (user) {
        this.parentUID = user.uid;

        this.fetchUserData();

        this.createLineGraphs();
      }
    });
  }

  ngAfterViewInit() {
    // Log to check if lineCanvases is populated
    console.log('Line Canvases:', this.lineCanvases);
    console.log('Pie Canvases:', this.pieCanvases);

    // Call the function to create the line graph after the view has been initialized
    this.createLineGraphs();
    this.createPieGraphs();

    // Subscribe to changes in lineCanvases
    this.lineCanvases.changes.subscribe(() => {
      console.log('Line Canvases (changes):', this.lineCanvases);
      this.createLineGraphs();
    });

    this.pieCanvases.changes.subscribe(() => {
      console.log('Pie Canvases (changes):', this.pieCanvases);
      this.createPieGraphs();
    });
  }

  createLineGraphs() {
    this.lineCanvases.forEach((canvasRef) => {
      if (canvasRef && canvasRef.nativeElement) {
        try {
          const uid = canvasRef.nativeElement.id.split('_')[1];
          const userData = this.usersData.find((user) => user.uid === uid);

          if (!userData) {
            // console.error(`User data not found for UID: ${uid}`);
            return;
          }

          const bmiData = userData.bmiHistory?.map((entry) => entry.bmi) || [];
          const dateLabels =
            userData.bmiHistory?.map((entry) => {
              // Format the date here as "yyyy/mm/dd"
              const formattedDate = new Date(entry.date).toLocaleDateString(
                'en-GB',
                {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }
              );
              return formattedDate;
            }) || [];

          const data = {
            labels: dateLabels,
            datasets: [
              {
                label: 'BMI Progress',
                data: bmiData,
                fill: true,
                backgroundColor: 'rgb(206, 218, 227, 0.6)', // Fill color with opacity
                borderColor: 'rgb(75, 192, 192)', // Line color
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 8,
                pointHoverRadius: 12,
                pointBackgroundColor: 'rgb(68, 147, 201)', // Point color
                pointBorderColor: 'rgb(68, 147, 201)', // Point border color
                pointBorderWidth: 2, // Point border width
              },
            ],
          };

          const options: any = {
            animations: {
              tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true,
              },
            },
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Dates',
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  color: '#333333',
                },
                ticks: {
                  color: '#333333',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'BMI Value',
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  color: '#333333',
                },
                ticks: {
                  color: '#333333',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: {
                    size: 14,
                    weight: 'bold',
                  },
                  color: '#333333',
                },
              },
            },
            backgroundColor: 'black', // Background color of chart
            responsive: true, // Make the chart responsive
          };

          const ctx = canvasRef.nativeElement.getContext('2d');

          // Destroy existing Chart instance
          Chart.getChart(ctx)?.destroy();
          if (bmiData.length === 0) {
            // Display a placeholder message or graph when there's no data
            ctx.fillStyle = '#333333';
            ctx.font = '16px Arial';
            ctx.fillText('No BMI data available', 10, 50);
          } else {
            const lineChart = new Chart(ctx, {
              type: 'line',
              data: data,
              options: options,
            });
          }
        } catch (error) {
          console.error(`Error creating graph: ${error.message}`);
        }
      }
    });
  }

  createPieGraphs() {
    this.pieCanvases.forEach((canvasRef) => {
      if (canvasRef && canvasRef.nativeElement) {
        try {
          const uid = canvasRef.nativeElement.id.split('_')[1];

          this.firestore
            .collection(`parents/${this.parentUID}/tasks`)
            .snapshotChanges()
            .pipe(
              map((actions) => {
                return actions.map((a) => {
                  const data = a.payload.doc.data() as any;
                  const id = a.payload.doc.id;
                  return { id, ...data };
                });
              })
            )
            .subscribe((tasks) => {
              const filteredTasks = tasks.filter((task) => task.userId === uid);

              const taskCounts = new Map<string, number>();

              filteredTasks.forEach((task) => {
                const description = task.description;
                taskCounts.set(
                  description,
                  (taskCounts.get(description) || 0) + 1
                );
              });

              const totalCount = Array.from(taskCounts.values()).reduce(
                (acc, count) => acc + count,
                0
              );

              const percentageData = Array.from(taskCounts.values()).map(
                (count) => parseFloat(((count / totalCount) * 100).toFixed(2))
              );

              this.userTaskDataMap.set(
                uid,
                Array.from(taskCounts.keys()).map((description, index) => ({
                  description,
                  count: taskCounts.get(description) || 0,
                  percentage: percentageData[index],
                }))
              );

              this.taskData = this.userTaskDataMap.get(uid) || [];

              const data = {
                labels: Array.from(taskCounts.keys()),
                datasets: [
                  {
                    data: percentageData,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(255, 206, 86, 0.7)',
                      'rgba(75, 192, 192, 0.7)', // Teal
                      'rgba(153, 102, 255, 0.7)', // Purple
                      'rgba(255, 159, 64, 0.7)', // Orange
                      'rgba(50, 205, 50, 0.7)', // Lime Green
                      'rgba(255, 0, 255, 0.7)', // Magenta
                    ],
                  },
                ],
              };

              const options: any = {
                borderWidth: 5,
                borderRadius: 15,
                hoverBorderWidth: 10,
                plugins: {
                  legend: {
                    display: false,
                    position: 'top',
                    align: 'start',
                    labels: {
                      textAlign: 'start', // Align legend text to the start (left)
                      generateLabels: function (chart: any) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                          return data.labels.map(function (
                            label: any,
                            i: number
                          ) {
                            const count = taskCounts.get(label) || 0;
                            const percentage = data.datasets[0].data[i];

                            return {
                              text: `${label}: ${count} tasks (${percentage.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}%)`,
                              fillStyle: data.datasets[0].backgroundColor[i],
                              hidden:
                                isNaN(percentage) ||
                                data.datasets[0].data[i] === 0,
                            };
                          });
                        }
                        return [];
                      },
                    },
                  },
                },
                layout: {
                  padding: {
                    left: 20, // Adjust the left padding of the legend container
                    right: 20, // Adjust the right padding of the legend container
                  },
                },
                // legend: {
                //   labels: {
                //     boxWidth: 20, // Width of each legend item
                //     boxHeight: 50, // Height of each legend item
                //     padding: 10, // Padding between legend items
                //   },
                // },
              };

              const ctx = canvasRef.nativeElement.getContext('2d');

              // Destroy existing Chart instance
              Chart.getChart(ctx)?.destroy();

              const pieChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: options,
              });
            });
        } catch (error) {
          console.error(`Error creating doughnut graph: ${error.message}`);
        }
      }
    });
  }

  fetchUserData() {
    // Fetch user data from Firestore in real-time
    this.firestore
      .collection('parents')
      .doc(this.parentUID)
      .collection('users')
      .snapshotChanges() // Use snapshotChanges() to listen to real-time changes
      .subscribe((querySnapshot) => {
        // Reset the usersData array
        this.usersData = [];

        // Iterate through the user documents
        querySnapshot.forEach((doc) => {
          const userData: UserData = {
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data(),
          } as UserData;
          this.usersData.push(userData);
        });

        // Call the function to create the line graphs after fetching user data
        this.createLineGraphs();
      });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.location.forward();
  }
}
