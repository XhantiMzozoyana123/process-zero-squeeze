import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SqueezePage } from './squeeze.page';

const routes: Routes = [
  {
    path: '',
    component: SqueezePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SqueezePageRoutingModule {}