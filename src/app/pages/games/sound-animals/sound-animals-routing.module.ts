import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoundAnimalsPage } from './sound-animals.page';

const routes: Routes = [
  {
    path: '',
    component: SoundAnimalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoundAnimalsPageRoutingModule {}
