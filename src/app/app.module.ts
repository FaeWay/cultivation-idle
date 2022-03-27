import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {GamedataService} from "./services/gamedata.service";
import {CoreModule} from "./components/core/core.module";
import {OverviewModule} from "./components/overview/overview.module";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {WandererModule} from "./phases/Stage00wanderer/wanderer.module";
import {FormsModule} from "@angular/forms";
import {ErrorHandlerService} from "./services/error-handler.service";
import {BuiltWithComponent} from "./components/misc/built-with/built-with.component";
import {NotfoundComponent} from "./components/misc/not-found/notfound.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {ResourceOverviewComponent} from "./components/resource-overview/resource-overview.component";
import {LocationsOverviewComponent} from "./components/locations-overview/locations-overview.component";
import {AudioService} from "./services/audio.service";


@NgModule({
  declarations: [
    AppComponent,
    BuiltWithComponent,
    NotfoundComponent,
    SettingsComponent,
    ResourceOverviewComponent,
    LocationsOverviewComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    CoreModule,
    OverviewModule,
    WandererModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    GamedataService,
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    }, AudioService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
