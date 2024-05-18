import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentsAcitvityPage } from './parents-acitvity.page';

const routes: Routes = [
  {
    path: '',
    component: ParentsAcitvityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentsAcitvityPageRoutingModule {}
