import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataPrivacyPageRoutingModule } from './data-privacy-routing.module';

import { DataPrivacyPage } from './data-privacy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataPrivacyPageRoutingModule
  ],
  declarations: [DataPrivacyPage]
})
export class DataPrivacyPageModule {}
