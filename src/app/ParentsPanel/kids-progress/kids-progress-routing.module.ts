import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KidsProgressPage } from './kids-progress.page';

const routes: Routes = [
  {
    path: '',
    component: KidsProgressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KidsProgressPageRoutingModule {}
