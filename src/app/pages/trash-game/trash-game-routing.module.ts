import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrashGamePage } from './trash-game.page';

const routes: Routes = [
  {
    path: '',
    component: TrashGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashGamePageRoutingModule {}
