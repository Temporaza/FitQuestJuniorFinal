import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchGamesPageRoutingModule } from './search-games-routing.module';

import { SearchGamesPage } from './search-games.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchGamesPageRoutingModule
  ],
  declarations: [SearchGamesPage]
})
export class SearchGamesPageModule {}
