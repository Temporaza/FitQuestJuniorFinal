import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameCountingPageRoutingModule } from './game-counting-routing.module';

import { GameCountingPage } from './game-counting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameCountingPageRoutingModule
  ],
  declarations: [GameCountingPage]
})
export class GameCountingPageModule {}
