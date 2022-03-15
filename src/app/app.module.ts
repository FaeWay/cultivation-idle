import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {GamedataService} from "./services/gamedata.service";
import {ProgressBarComponent} from "./components/core/progress-bar/progress-bar.component";
import {OverviewComponent} from "./components/overview/overview.component";

@NgModule({
  declarations: [AppComponent, ProgressBarComponent, OverviewComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, GamedataService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
