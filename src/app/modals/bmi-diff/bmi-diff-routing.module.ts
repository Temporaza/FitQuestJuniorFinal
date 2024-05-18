import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BmiDiffPage } from './bmi-diff.page';

const routes: Routes = [
  {
    path: '',
    component: BmiDiffPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BmiDiffPageRoutingModule {}
