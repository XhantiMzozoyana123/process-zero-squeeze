import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'squeeze',
    pathMatch: 'full',
  },
  {
    path: 'squeeze',
    loadChildren: () => import('./pages/squeeze/squeeze.module').then(m => m.SqueezePageModule),
  },
  {
    path: '**',
    redirectTo: 'squeeze',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}