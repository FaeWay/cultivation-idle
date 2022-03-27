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
  public selectedLocationName: string;
  public selectedLocation: IAdventureLocation;
  public hideLocationSelect: false;
  private possibleLocations: Array<IAdventureLocation>;

  //herb select bidnings
  public selectedHerbName: string;
  public possibleHerbs: Array<IBaseItem>;
  public selectedHerb: IBaseItem;

  gds: GamedataService;

  constructor(private data: GamedataService) {
    this.gds = data;
    this.possibleHerbs = new Array<IBaseItem>();

  }

  ngOnInit() {
    this.possibleLocations = this.gds.GetKnowLocationsFromBase(this.baseLocation);
  }

  updateSelectionLocation() {
    for (let i = 0; i < this.possibleLocations.length; i++) {
      let loc = this.possibleLocations[i];
      if (loc.name.localeCompare(this.selectedLocationName) === 0) {
        this.selectedLocation = loc;
      }
    }
  }

  showSearchForHerbs(): boolean {
    if (this.selectedLocation === undefined)
      return false;
    if (this.gds.HaveDiscoveredAllElementVariantsInArea(this.selectedLocation, this.weakSpiritHerb)) {
      return false;
    }
    return true;
  }

  foundAllLocations(): boolean {
    return this.gds.FoundAllSubLocations(this.selectedLocation);
  }

  knowAboutHerbs(): boolean {
    if (this.gds.IsBaseItemKnown(this.weakSpiritHerb)) {
      this.possibleHerbs = this.gds.GetAllKnownResourcesOfType(this.weakSpiritHerb);
      return true;
    }
    return false;
  }

  herbSelectionChanged() {
    for (let i = 0; i < this.possibleHerbs.length; i++) {
      let h = this.possibleHerbs[i];
      if (h.displayName.localeCompare(this.selectedHerbName) === 0) {
        this.selectedHerb = h;
      }
    }
  }

  startGathering() {
    this.gds.StopTimerForItem(this.selectedHerb);
    this.gds.StartRestartResourceTimer(this.selectedHerb);
  }
}
