import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrashPageRoutingModule } from './trash-routing.module';

import { TrashPage } from './trash.page';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrashPageRoutingModule,
    DragDropModule,
  ],
  declarations: [TrashPage],
})
export class TrashPageModule {}
