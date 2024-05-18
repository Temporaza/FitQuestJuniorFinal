import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddusermodalPage } from './addusermodal.page';

const routes: Routes = [
  {
    path: '',
    component: AddusermodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddusermodalPageRoutingModule {}
