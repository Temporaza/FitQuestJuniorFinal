import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataPrivacyPage } from './data-privacy.page';

const routes: Routes = [
  {
    path: '',
    component: DataPrivacyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataPrivacyPageRoutingModule {}
