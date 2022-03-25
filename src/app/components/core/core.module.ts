import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {ItemProgressBar} from "./item-progress-bar/item-progress-bar.component";
import {ManuallyUnlockNewItemComponent} from "./manually-unlock-new-item/manually-unlock-new-item.component";
import {ResourceConsumerActionComponent} from "./resource-consumer-action/resource-consumer-action.component";
import {GeneralActionRepeatableComponent} from "./general-action-repeatable/general-action-repeatable.component";

@NgModule({
  declarations: [ItemProgressBar, ManuallyUnlockNewItemComponent, ResourceConsumerActionComponent, GeneralActionRepeatableComponent],
  exports: [
    ItemProgressBar, ManuallyUnlockNewItemComponent, ResourceConsumerActionComponent, GeneralActionRepeatableComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CoreModule {
}
