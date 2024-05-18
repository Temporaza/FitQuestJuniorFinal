import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailVerificationRequiredPage } from './email-verification-required.page';

const routes: Routes = [
  {
    path: '',
    component: EmailVerificationRequiredPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailVerificationRequiredPageRoutingModule {}
