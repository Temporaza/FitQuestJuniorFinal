import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BmiDiffPageRoutingModule } from './bmi-diff-routing.module';

import { BmiDiffPage } from './bmi-diff.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BmiDiffPageRoutingModule
  ],
  declarations: [BmiDiffPage]
})
export class BmiDiffPageModule {}
