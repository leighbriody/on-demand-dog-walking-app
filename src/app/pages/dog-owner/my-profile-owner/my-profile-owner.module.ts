import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileOwnerPageRoutingModule } from './my-profile-owner-routing.module';

import { MyProfileOwnerPage } from './my-profile-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileOwnerPageRoutingModule
  ],
  declarations: [MyProfileOwnerPage]
})
export class MyProfileOwnerPageModule {}
