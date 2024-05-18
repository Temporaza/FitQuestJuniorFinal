import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShapeMatchPageRoutingModule } from './shape-match-routing.module';

import { ShapeMatchPage } from './shape-match.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShapeMatchPageRoutingModule
  ],
  declarations: [ShapeMatchPage]
})
export class ShapeMatchPageModule {}
