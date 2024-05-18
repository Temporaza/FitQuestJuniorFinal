import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentDetailsModalPage } from './parent-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ParentDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentDetailsModalPageRoutingModule {}
