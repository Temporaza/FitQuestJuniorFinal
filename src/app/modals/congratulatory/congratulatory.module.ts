import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CongratulatoryPageRoutingModule } from './congratulatory-routing.module';

import { CongratulatoryPage } from './congratulatory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CongratulatoryPageRoutingModule
  ],
  declarations: [CongratulatoryPage]
})
export class CongratulatoryPageModule {}
