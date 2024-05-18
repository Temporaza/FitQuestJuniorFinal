import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddusermodalPageRoutingModule } from './addusermodal-routing.module';

import { AddusermodalPage } from './addusermodal.page';
ReactiveFormsModule;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddusermodalPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddusermodalPage],
})
export class AddusermodalPageModule {}
