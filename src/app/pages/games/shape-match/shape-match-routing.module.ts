import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShapeMatchPage } from './shape-match.page';

const routes: Routes = [
  {
    path: '',
    component: ShapeMatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShapeMatchPageRoutingModule {}
