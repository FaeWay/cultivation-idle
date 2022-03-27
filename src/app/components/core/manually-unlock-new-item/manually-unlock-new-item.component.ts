import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBaseItem} from "../../../models/items/baseItem.model";
import {GamedataService} from "../../../services/gamedata.service";
import {IAdventureLocation} from "../../../models/locations/location.model";


@Component({
  selector: 'cvi-unlock-new-item',
  templateUrl: './manually-unlock-new-item.component.html',
  styleUrls: ['./manually-unlock-new-item.component.scss'],
})
export class ManuallyUnlockNewItemComponent implements OnInit {

  @Input()
  item: IBaseItem;

  @Input()
  baseLocation: IAdventureLocation;

  @Input()
  isRandomItemFromBase: boolean;

  @Input()
  actionName: string;

  @Input()
  isDisabled: boolean = false;

  public isLocationUnlock: boolean = false;

  constructor(public gds: GamedataService) {
  }

  ngOnInit() {
    if (!this.isRandomItemFromBase) {
      this.isLocationUnlock = true;
      this.gds.SetNewRandomSubLocationToFind(this.baseLocation);
    }
  }


  public StartUnlockOrDiscovery(): void {
    if (this.isLocationUnlock) {
      this.gds.StartRestartAdventureTimer(this.gds.GetCurrentRandomSubLocationUnlock(this.baseLocation))
    } else if (this.isRandomItemFromBase) {
      //TODO: Make this NOT instant
      this.gds.StartRestartRandomResourceTimer(this.item, this.baseLocation);
    } else if (!this.isLocationUnlock && !this.isRandomItemFromBase) {
      this.gds.StartRestartResourceTimer(this.item);
    } else {
      throw new Error("Unable to correctly start a Timer for either: LocationUnlock, New Item Random Element or Existing Item")
    }
  }

  public GetBarValue(): number {
    if (this.isLocationUnlock) {
      return this.gds.GetCurrentRandomSubLocationUnlock(this.baseLocation).barValue;
    }
    if (this.isRandomItemFromBase) {
      //Might not exist (as we havent started yet!)
      if (this.gds.GetCurrentRandomItemUnlockByLocation(this.baseLocation)) {
        return this.gds.GetCurrentRandomItemUnlockByLocation(this.baseLocation).barValue;
      }
    }
    if (!this.isRandomItemFromBase && !this.isLocationUnlock) {
      return this.item.barValue
    }
    return 0;
  }
}
