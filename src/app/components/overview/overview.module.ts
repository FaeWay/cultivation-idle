import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {OverviewComponent} from "./overview.component";
import {CoreModule} from "../core/core.module";

@NgModule({
  declarations: [OverviewComponent],
  exports: [
  ],
  imports: [
    CommonModule,
    IonicModule,
    CoreModule
  ]
})
export class OverviewModule {
}
