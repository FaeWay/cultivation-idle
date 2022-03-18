import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NotfoundComponent} from "./components/misc/not-found/notfound.component";
import {BuiltWith} from "./components/misc/built-with/built-with.component";
import {SettingsComponent} from "./components/settings/settings.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  }, {
    path: 'overview',
    loadChildren: () => import('./components/overview/overview-routing.module').then(m => m.OverviewRoutingModule)
  }, {
    path: 'wanderer',
    loadChildren: () => import('./phases/Stage00wanderer/wanderer-routing.module').then(m => m.WandererRoutingModule)
  }, {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'built-with',
    component: BuiltWith
  },
  {
    path: "**",
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
