import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParentRegisterPageRoutingModule } from './parent-register-routing.module';

import { ParentRegisterPage } from './parent-register.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ParentRegisterPageRoutingModule
  ],
  declarations: [ParentRegisterPage]
})
export class ParentRegisterPageModule {}
