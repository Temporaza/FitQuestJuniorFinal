import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuestTheNumbersPageRoutingModule } from './guest-the-numbers-routing.module';

import { GuestTheNumbersPage } from './guest-the-numbers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuestTheNumbersPageRoutingModule
  ],
  declarations: [GuestTheNumbersPage]
})
export class GuestTheNumbersPageModule {}
