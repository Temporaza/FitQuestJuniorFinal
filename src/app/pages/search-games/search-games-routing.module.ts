import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchGamesPage } from './search-games.page';

const routes: Routes = [
  {
    path: '',
    component: SearchGamesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchGamesPageRoutingModule {}
