import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailVerificationRequiredPageRoutingModule } from './email-verification-required-routing.module';

import { EmailVerificationRequiredPage } from './email-verification-required.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailVerificationRequiredPageRoutingModule
  ],
  declarations: [EmailVerificationRequiredPage]
})
export class EmailVerificationRequiredPageModule {}
