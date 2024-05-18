import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BirthdayModalPage } from './birthday-modal.page';

const routes: Routes = [
  {
    path: '',
    component: BirthdayModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BirthdayModalPageRoutingModule {}
