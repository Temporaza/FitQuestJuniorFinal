import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestTheNumbersPage } from './guest-the-numbers.page';

const routes: Routes = [
  {
    path: '',
    component: GuestTheNumbersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestTheNumbersPageRoutingModule {}
