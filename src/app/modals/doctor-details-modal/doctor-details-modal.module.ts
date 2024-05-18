import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorDetailsModalPageRoutingModule } from './doctor-details-modal-routing.module';

import { DoctorDetailsModalPage } from './doctor-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorDetailsModalPageRoutingModule
  ],
  declarations: [DoctorDetailsModalPage]
})
export class DoctorDetailsModalPageModule {}
