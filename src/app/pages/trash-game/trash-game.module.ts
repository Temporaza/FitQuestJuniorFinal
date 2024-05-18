import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrashGamePageRoutingModule } from './trash-game-routing.module';

import { TrashGamePage } from './trash-game.page';

import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrashGamePageRoutingModule,
    DragDropModule,
  ],
  declarations: [TrashGamePage],
})
export class TrashGamePageModule {}
