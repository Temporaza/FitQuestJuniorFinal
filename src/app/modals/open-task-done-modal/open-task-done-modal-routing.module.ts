import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenTaskDoneModalPage } from './open-task-done-modal.page';

const routes: Routes = [
  {
    path: '',
    component: OpenTaskDoneModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenTaskDoneModalPageRoutingModule {}
