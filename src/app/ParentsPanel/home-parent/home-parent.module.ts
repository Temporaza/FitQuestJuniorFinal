import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeParentPageRoutingModule } from './home-parent-routing.module';

import { HomeParentPage } from './home-parent.page';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HomeParentPageRoutingModule,
  ],
  declarations: [HomeParentPage],
})
export class HomeParentPageModule {}
