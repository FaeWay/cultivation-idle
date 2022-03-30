import {Component, Input, OnInit} from '@angular/core';
import {IBaseItem} from "../../../../models/items/baseItem.model";
import {IAdventureLocation} from "../../../../models/locations/location.model";
import {GamedataService} from "../../../../services/gamedata.service";

@Component({
  selector: 'cvi-wanderer-wandering',
  templateUrl: './wanderer-wandering.component.html',
  styleUrls: ['./wanderer-wandering.component.scss'],
})
export class WandererWanderingComponent implements OnInit {

  //TODO: decide if locations passed into here decide on locations drive items. Makes more sense, really.
  @Input()
  weakSpiritHerb: IBaseItem; //discoverable item would make more sense here

  @Input()
  baseLocation: IAdventureLocation;

  //location select bindings
  public hideLocationSelect: false;
  private possibleLocations: Array<IAdventureLocation>;

  //herb select bidnings
  public possibleHerbs: Array<IBaseItem>;

  gds: GamedataService;

  constructor(private data: GamedataService) {
    this.gds = data;
    this.possibleHerbs = new Array<IBaseItem>();

  }

  ngOnInit() {
    this.possibleLocations = this.gds.GetKnowLocationsFromBase(this.baseLocation);
  }

  showSearchForHerbs(): boolean {
    if (this.gds.wandererLocationToSearchForNewHerbs === undefined)
      return false;
    if (this.gds.HaveDiscoveredAllElementVariantsInArea(this.gds.wandererLocationToSearchForNewHerbs, this.weakSpiritHerb)) {
      return false;
    }
    return true;
  }

  foundAllLocations(): boolean {
    return this.gds.FoundAllSubLocations(this.gds.wandererLocationToSearchForNewHerbs);
  }

  knowAboutHerbs(): boolean {
    if (this.gds.IsBaseItemKnown(this.weakSpiritHerb)) {
      this.possibleHerbs = this.gds.GetAllKnownResourcesOfType(this.weakSpiritHerb);
      return true;
    }
    return false;
  }

  startGathering() {
    this.gds.StopTimerForItem(this.gds.wandererHerbCurrentlyBeingGathered);
    this.gds.StartRestartResourceTimer(this.gds.wandererHerbCurrentlyBeingGathered);
  }
}
