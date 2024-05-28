import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityLogModalPageRoutingModule } from './activity-log-modal-routing.module';

import { ActivityLogModalPage } from './activity-log-modal.page';
import { DurationPipe } from 'src/app/DurationPipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityLogModalPageRoutingModule,
  ],
  declarations: [ActivityLogModalPage, DurationPipe],
})
export class ActivityLogModalPageModule {}
