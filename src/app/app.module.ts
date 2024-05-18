import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { IonicStorageModule } from '@ionic/storage-angular';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SwiperModule } from 'swiper/angular';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';


// import { FirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    SwiperModule,
    AngularFireModule, 
    AngularFireAuthModule, 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    DragDropModule,
    IonicStorageModule.forRoot(),
    
    // FirestoreModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy}],

  // providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
