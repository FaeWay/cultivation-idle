import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {ItemProgressBar} from "./item-progress-bar/item-progress-bar.component";
import {ManuallyUnlockNewItemComponent} from "./manually-unlock-new-item/manually-unlock-new-item.component";

@NgModule({
  declarations: [ItemProgressBar, ManuallyUnlockNewItemComponent],
  exports: [
    ItemProgressBar, ManuallyUnlockNewItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CoreModule {
}
