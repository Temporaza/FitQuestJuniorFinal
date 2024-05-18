import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestTheColorsPage } from './guest-the-colors.page';

const routes: Routes = [
  {
    path: '',
    component: GuestTheColorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestTheColorsPageRoutingModule {}
