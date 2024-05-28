import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityLogModalPage } from './activity-log-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityLogModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityLogModalPageRoutingModule {}
