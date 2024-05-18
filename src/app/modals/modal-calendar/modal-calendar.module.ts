import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCalendarPageRoutingModule } from './modal-calendar-routing.module';

import { ModalCalendarPage } from './modal-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCalendarPageRoutingModule
  ],
  declarations: [ModalCalendarPage]
})
export class ModalCalendarPageModule {}
