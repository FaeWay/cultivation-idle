import {Component, OnInit} from '@angular/core';
import {GamedataService} from "../../services/gamedata.service";

@Component({
  selector: 'cvi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(public gds: GamedataService) {
  }

  ngOnInit() {
  }

  async deleteGame() {
    await this.gds.DeleteGame();
  }

}
