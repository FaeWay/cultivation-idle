import { Component, OnInit } from '@angular/core';
import {GamedataService} from "../../services/gamedata.service";

@Component({
  selector: 'cvi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  private gds: GamedataService;
  constructor(private data:GamedataService) {
    this.gds = data;
  }

  ngOnInit() {}

  async deleteGame() {
    await this.gds.DeleteGame();
  }

}
