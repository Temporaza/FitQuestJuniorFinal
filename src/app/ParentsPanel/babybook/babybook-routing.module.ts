import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BabybookPage } from './babybook.page';

const routes: Routes = [
  {
    path: '',
    component: BabybookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BabybookPageRoutingModule {}
