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


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    OverviewModule,
    WandererModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FormsModule
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    GamedataService,
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
