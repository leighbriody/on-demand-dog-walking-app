import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkerProfilePageRoutingModule } from './walker-profile-routing.module';

import { WalkerProfilePage } from './walker-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalkerProfilePageRoutingModule
  ],
  declarations: [WalkerProfilePage]
})
export class WalkerProfilePageModule {}
