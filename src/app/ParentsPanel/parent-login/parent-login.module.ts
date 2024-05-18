import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentLoginPageRoutingModule } from './parent-login-routing.module';

import { ParentLoginPage } from './parent-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ParentLoginPageRoutingModule
  ],
  declarations: [ParentLoginPage]
})
export class ParentLoginPageModule {}
