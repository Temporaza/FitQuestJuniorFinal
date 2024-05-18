import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentDetailsModalPageRoutingModule } from './parent-details-modal-routing.module';

import { ParentDetailsModalPage } from './parent-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParentDetailsModalPageRoutingModule
  ],
  declarations: [ParentDetailsModalPage]
})
export class ParentDetailsModalPageModule {}
