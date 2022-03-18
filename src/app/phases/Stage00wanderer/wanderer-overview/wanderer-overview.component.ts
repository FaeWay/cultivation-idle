import {Component, OnInit} from '@angular/core';
import {GamedataService} from "../../../services/gamedata.service";
import {WeakSpiritHerb} from "../../../models/items/herbs/weakspiritherb";
import {Element} from "../../../models/items/elements";
import {IAdventureLocation} from "../../../models/locations/location.model";
import {
  BambooForest,
  BambooForestDepths,
  BambooForestFringe,
  BambooForestGrove
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
  //Locations found when wandering
  locations: Array<IAdventureLocation> = new Array<IAdventureLocation>();

  constructor(private gameData: GamedataService) {
    this.activeSegment = 'wanderer-overview';
    this.gds = gameData;
    this.locations.push(new BambooForest());
    this.locations.push(new BambooForestFringe());
    this.locations.push(new BambooForestGrove());
    this.locations.push(new BambooForestDepths());
    this.spiritHerb = new WeakSpiritHerb(Element.NULL);
  }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    this.activeSegment = ev.detail['value'];
  }
}
