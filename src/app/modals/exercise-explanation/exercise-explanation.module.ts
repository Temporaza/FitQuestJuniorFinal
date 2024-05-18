import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseExplanationPageRoutingModule } from './exercise-explanation-routing.module';

import { ExerciseExplanationPage } from './exercise-explanation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseExplanationPageRoutingModule
  ],
  declarations: [ExerciseExplanationPage]
})
export class ExerciseExplanationPageModule {}
