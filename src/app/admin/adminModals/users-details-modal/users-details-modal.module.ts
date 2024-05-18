import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersDetailsModalPageRoutingModule } from './users-details-modal-routing.module';

import { UsersDetailsModalPage } from './users-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersDetailsModalPageRoutingModule
  ],
  declarations: [UsersDetailsModalPage]
})
export class UsersDetailsModalPageModule {}
