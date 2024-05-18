import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentsProfilePagePageRoutingModule } from './parents-profile-page-routing.module';

import { ParentsProfilePagePage } from './parents-profile-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParentsProfilePagePageRoutingModule
  ],
  declarations: [ParentsProfilePagePage]
})
export class ParentsProfilePagePageModule {}
