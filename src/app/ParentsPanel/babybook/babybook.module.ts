import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BabybookPageRoutingModule } from './babybook-routing.module';

import { BabybookPage } from './babybook.page';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BabybookPageRoutingModule,
    SwiperModule,
  ],
  declarations: [BabybookPage],
})
export class BabybookPageModule {}
