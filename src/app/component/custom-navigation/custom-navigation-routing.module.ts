import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomNavigationPage } from './custom-navigation.page';

const routes: Routes = [
  {
    path: '',
    component: CustomNavigationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomNavigationPageRoutingModule {}
