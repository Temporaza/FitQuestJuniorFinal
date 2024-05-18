import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuestTheColorsPageRoutingModule } from './guest-the-colors-routing.module';

import { GuestTheColorsPage } from './guest-the-colors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuestTheColorsPageRoutingModule
  ],
  declarations: [GuestTheColorsPage]
})
export class GuestTheColorsPageModule {}
