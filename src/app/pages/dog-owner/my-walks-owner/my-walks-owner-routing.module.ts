import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyWalksOwnerPage } from './my-walks-owner.page';

const routes: Routes = [
  {
    path: '',
    component: MyWalksOwnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWalksOwnerPageRoutingModule {}
