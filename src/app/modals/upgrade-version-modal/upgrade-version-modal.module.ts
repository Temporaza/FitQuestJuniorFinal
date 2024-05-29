import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpgradeVersionModalPageRoutingModule } from './upgrade-version-modal-routing.module';

import { UpgradeVersionModalPage } from './upgrade-version-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpgradeVersionModalPageRoutingModule
  ],
  declarations: [UpgradeVersionModalPage]
})
export class UpgradeVersionModalPageModule {}
