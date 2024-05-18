import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersDetailsModalPage } from './users-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UsersDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersDetailsModalPageRoutingModule {}
