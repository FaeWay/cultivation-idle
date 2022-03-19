import {Component, OnInit} from '@angular/core';
import {GamedataService} from "../../../services/gamedata.service";
import {WeakSpiritHerb} from "../../../models/items/herbs/weakspiritherb";
import {Element} from "../../../models/items/elements";
import {IAdventureLocation} from "../../../models/locations/location.model";
import {
  BambooForest
} from "../../../models/locations/bamboo-forest/bamboo-forest.location.model";


@Component({
  selector: 'cvi-wanderer',
  templateUrl: './wanderer-overview.component.html',
  styleUrls: ['./wanderer-overview.component.scss'],
})

export class WandererOverviewComponent implements OnInit {
  activeSegment: string;
  private gds: GamedataService;
  //Items found in wandering
  spiritHerb: WeakSpiritHerb;
  //base location found when wandering
  baseLocation: IAdventureLocation;

  constructor(private gameData: GamedataService) {
    this.activeSegment = 'wanderer-overview';
    this.gds = gameData;
    this.baseLocation = new BambooForest();
    this.spiritHerb = new WeakSpiritHerb(Element.NULL);
  }

  ngOnInit() {
    this.baseLocation = new BambooForest();
  }

  segmentChanged(ev: any) {
    this.activeSegment = ev.detail['value'];
  }
}
