import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {WandererOverviewComponent} from "./wanderer-overview/wanderer-overview.component";
import {WandererCraftingComponent} from "./actions/wanderer-crafting/wanderer-crafting.component";
import {WandererWanderingComponent} from "./actions/wanderer-wandering/wanderer-wandering.component";
import {WandererTrainingComponent} from "./actions/wanderer-training/wanderer-training.component";
import {CoreModule} from "../../components/core/core.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [WandererOverviewComponent, WandererCraftingComponent, WandererWanderingComponent, WandererTrainingComponent],
  exports: [
    WandererOverviewComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        CoreModule,
        FormsModule,
    ]
})
export class WandererModule {
}
