import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpgradeVersionModalPage } from './upgrade-version-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpgradeVersionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpgradeVersionModalPageRoutingModule {}
