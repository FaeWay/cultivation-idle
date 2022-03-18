import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WandererOverviewComponent} from "./wanderer-overview/wanderer-overview.component";
import {NotfoundComponent} from "../../components/misc/not-found/notfound.component";

const routes: Routes = [
  {
    path: '',
    component: WandererOverviewComponent,
    children: [
    ]},  {
    path: "**",
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WandererRoutingModule {
}
