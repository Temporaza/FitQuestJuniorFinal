import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { KidsProgressPageRoutingModule } from './kids-progress-routing.module';
import { KidsProgressPage } from './kids-progress.page';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot(), // Import IonicModule.forRoot() here
    KidsProgressPageRoutingModule
  ],
  declarations: [
    KidsProgressPage,
  ]
})
export class KidsProgressPageModule {}
