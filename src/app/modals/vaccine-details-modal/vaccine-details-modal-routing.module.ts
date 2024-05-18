import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VaccineDetailsModalPage } from './vaccine-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: VaccineDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaccineDetailsModalPageRoutingModule {}
