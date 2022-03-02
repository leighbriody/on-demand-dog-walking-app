import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyWalksOwnerPageRoutingModule } from './my-walks-owner-routing.module';

import { MyWalksOwnerPage } from './my-walks-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyWalksOwnerPageRoutingModule
  ],
  declarations: [MyWalksOwnerPage]
})
export class MyWalksOwnerPageModule {}
