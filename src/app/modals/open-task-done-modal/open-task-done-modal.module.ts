import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenTaskDoneModalPageRoutingModule } from './open-task-done-modal-routing.module';

import { OpenTaskDoneModalPage } from './open-task-done-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenTaskDoneModalPageRoutingModule
  ],
  declarations: [OpenTaskDoneModalPage]
})
export class OpenTaskDoneModalPageModule {}
