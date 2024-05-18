import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameCountingPage } from './game-counting.page';

const routes: Routes = [
  {
    path: '',
    component: GameCountingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameCountingPageRoutingModule {}
