import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalkerProfilePage } from './walker-profile.page';

const routes: Routes = [
  {
    path: '',
    component: WalkerProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalkerProfilePageRoutingModule {}
