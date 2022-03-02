import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileOwnerPage } from './my-profile-owner.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfileOwnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileOwnerPageRoutingModule {}
