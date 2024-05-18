import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCalendarPage } from './modal-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCalendarPageRoutingModule {}
