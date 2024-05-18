import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface BMIRecord {
  date: string;
  bmi: number;
}

interface UserData {
  fullname?: string;
  bmiHistory?: BMIRecord[];
  // Add other properties as needed
}


@Component({
  selector: 'app-bmi-diff',
  templateUrl: './bmi-diff.page.html',
  styleUrls: ['./bmi-diff.page.scss'],
})
export class BmiDiffPage implements OnInit {

  @Input() userData: UserData;


  constructor(private modalController: ModalController,
    private authFire: AngularFireAuth
) { }

ngOnInit() {
  this.authFire.authState.subscribe((user) => {
    if (user) {
      console.log('Current parent UID:', user.uid);
    }
  });
}

  dismissModal() {
    this.modalController.dismiss();
  }

  calculateBmiDifference(currentRecord: BMIRecord, previousRecord: BMIRecord): number {
    return currentRecord.bmi - previousRecord.bmi;
  }

  calculateDaysDifference(currentRecord: BMIRecord, previousRecord: BMIRecord): number {
    const currentDate = new Date(currentRecord.date);
    const previousDate = new Date(previousRecord.date);

    // Calculate the difference in days
    const timeDifference = currentDate.getTime() - previousDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference;
  }
}
