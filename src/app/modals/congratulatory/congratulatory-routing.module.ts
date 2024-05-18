import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CongratulatoryPage } from './congratulatory.page';

const routes: Routes = [
  {
    path: '',
    component: CongratulatoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CongratulatoryPageRoutingModule {}
