import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestGamePage } from './guest-game.page';

const routes: Routes = [
  {
    path: '',
    component: GuestGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestGamePageRoutingModule {}
