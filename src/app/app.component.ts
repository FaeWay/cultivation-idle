import {Component, OnInit} from '@angular/core';
import {GamedataService} from "./services/gamedata.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  gds: GamedataService
  constructor(private gameData: GamedataService) {
    this.gds = gameData;
  }

  ngOnInit() {

  }

}
