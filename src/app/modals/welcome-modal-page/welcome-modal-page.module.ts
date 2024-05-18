import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeModalPagePageRoutingModule } from './welcome-modal-page-routing.module';

import { WelcomeModalPagePage } from './welcome-modal-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeModalPagePageRoutingModule
  ],
  declarations: [WelcomeModalPagePage]
})
export class WelcomeModalPagePageModule {}
