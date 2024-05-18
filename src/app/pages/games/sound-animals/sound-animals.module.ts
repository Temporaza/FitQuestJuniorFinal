import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoundAnimalsPageRoutingModule } from './sound-animals-routing.module';

import { SoundAnimalsPage } from './sound-animals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoundAnimalsPageRoutingModule
  ],
  declarations: [SoundAnimalsPage]
})
export class SoundAnimalsPageModule {}
