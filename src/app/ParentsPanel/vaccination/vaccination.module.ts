import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VaccinationPageRoutingModule } from './vaccination-routing.module';

import { VaccinationPage } from './vaccination.page';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    VaccinationPageRoutingModule,
  ],
  declarations: [VaccinationPage],
})
export class VaccinationPageModule {}
