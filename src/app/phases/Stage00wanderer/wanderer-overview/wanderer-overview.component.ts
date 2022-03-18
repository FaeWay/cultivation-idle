import {Component, OnInit} from '@angular/core';
import {GamedataService} from "../../../services/gamedata.service";


@Component({
  selector: 'cvi-wanderer',
  templateUrl: './wanderer-overview.component.html',
  styleUrls: ['./wanderer-overview.component.scss'],
})

export class WandererOverviewComponent implements OnInit {

  activeSegment: string;
  private gds: GamedataService;
  constructor(private gameData:GamedataService) {
    this.activeSegment = 'wanderer-overview';
    this.gds = gameData;
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.activeSegment = ev.detail['value'];
  }
}
