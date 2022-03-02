import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyWalksWalkerPageRoutingModule } from './my-walks-walker-routing.module';

import { MyWalksWalkerPage } from './my-walks-walker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyWalksWalkerPageRoutingModule
  ],
  declarations: [MyWalksWalkerPage]
})
export class MyWalksWalkerPageModule {}
