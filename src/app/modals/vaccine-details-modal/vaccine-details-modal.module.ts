import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VaccineDetailsModalPageRoutingModule } from './vaccine-details-modal-routing.module';

import { VaccineDetailsModalPage } from './vaccine-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VaccineDetailsModalPageRoutingModule
  ],
  declarations: [VaccineDetailsModalPage]
})
export class VaccineDetailsModalPageModule {}
