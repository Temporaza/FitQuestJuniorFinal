import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { CustomNavigationPage } from 'src/app/component/custom-navigation/custom-navigation.page';

@NgModule({
  declarations: [
    CustomNavigationPage,
    // Add other components, directives, and pipes here
  ],
  imports: [
    CommonModule,
    IonicModule // Import IonicModule here
  ],
  exports: [
    CustomNavigationPage,
    // Export other components, directives, and pipes here
  ]
})
export class SharedModule {}
