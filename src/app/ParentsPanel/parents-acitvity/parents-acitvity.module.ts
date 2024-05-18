import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { ParentsAcitvityPageRoutingModule } from './parents-acitvity-routing.module';
import { ParentsAcitvityPage } from './parents-acitvity.page';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot(), // Import IonicModule.forRoot() here
    ParentsAcitvityPageRoutingModule
  ],
  declarations: [
    ParentsAcitvityPage
  ]
})
export class ParentsAcitvityPageModule {}
