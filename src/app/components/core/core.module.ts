import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {UnlockNewItemComponent} from "./unlock-new-item/unlock-new-item.component";
import {ItemProgressBar} from "./item-progress-bar/item-progress-bar.component";

@NgModule({
  declarations: [ItemProgressBar, UnlockNewItemComponent],
  exports: [
    ItemProgressBar, UnlockNewItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CoreModule {
}
