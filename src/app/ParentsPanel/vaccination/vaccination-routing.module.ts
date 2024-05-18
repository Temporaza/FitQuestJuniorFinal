import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VaccinationPage } from './vaccination.page';

const routes: Routes = [
  {
    path: '',
    component: VaccinationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaccinationPageRoutingModule {}
