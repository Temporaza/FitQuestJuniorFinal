import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuestGamePageRoutingModule } from './guest-game-routing.module';

import { GuestGamePage } from './guest-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuestGamePageRoutingModule
  ],
  declarations: [GuestGamePage]
})
export class GuestGamePageModule {}
