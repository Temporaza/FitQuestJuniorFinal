import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentsProfilePagePage } from './parents-profile-page.page';

const routes: Routes = [
  {
    path: '',
    component: ParentsProfilePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentsProfilePagePageRoutingModule {}
