import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserModalPageRoutingModule } from './edit-user-modal-routing.module';

import { EditUserModalPage } from './edit-user-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUserModalPageRoutingModule
  ],
  declarations: [EditUserModalPage]
})
export class EditUserModalPageModule {}
