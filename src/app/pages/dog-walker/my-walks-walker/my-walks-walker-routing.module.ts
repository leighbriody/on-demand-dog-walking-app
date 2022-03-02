import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyWalksWalkerPage } from './my-walks-walker.page';

const routes: Routes = [
  {
    path: '',
    component: MyWalksWalkerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWalksWalkerPageRoutingModule {}
