import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorDetailsModalPage } from './doctor-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorDetailsModalPageRoutingModule {}
