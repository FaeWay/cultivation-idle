import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from "./components/overview/overview.component";
import {WandererComponent} from "./phases/Stage00wanderer/wanderer/wanderer.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }, {
    path: 'overview',
    component: OverviewComponent
  }, {
    path: 'wanderer',
    component: WandererComponent
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
