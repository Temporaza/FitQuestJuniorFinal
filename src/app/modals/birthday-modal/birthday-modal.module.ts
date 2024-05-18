import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BirthdayModalPageRoutingModule } from './birthday-modal-routing.module';

import { BirthdayModalPage } from './birthday-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BirthdayModalPageRoutingModule
  ],
  declarations: [BirthdayModalPage]
})
export class BirthdayModalPageModule {}
