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
  generateRandomItemFromBase: boolean;

  @Input()
  isLocationUnlock: boolean;

  @Input()
  actionName: string;

  @Output()
  delayComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  private timer: any;
  private locBarPerc: number;
  private randomUnlockLocaiton: IAdventureLocation;
  private gds: GamedataService;
  public barVal: number = 0;


  constructor(private data: GamedataService) {
    this.gds = data;
  }

  ngOnInit() {
    if (this.isLocationUnlock) {
      this.randomUnlockLocaiton = this.gds.FindRandomSubLocation(this.baseLocation);
      if (this.randomUnlockLocaiton !== undefined) {
        this.locBarPerc = 100 / (this.randomUnlockLocaiton.unlockTime / 100) / 100;
        if (this.locBarPerc === undefined) {
          throw Error("Location % Per-Tick is NaN")
        }
      }
    }
  }


  public RandomElementNewItem() {
    this.gds.GenerateRandomElementFromLocationItem(this.baseLocation, this.item)
  }

  public SpecificElementNewItem(item: IBaseItem) {
    this.gds.UpSertResourceValue(item, item.baseResourceAmount);
  }

  public AllNeededFields() {
    if (this.item === undefined) {
      return true;
    }
    if (this.baseLocation === undefined) {
      return true;
    }
    if (this.isLocationUnlock && this.generateRandomItemFromBase)
      throw new Error("Unlock a location OR an item. NOT BOTH");
    return false;
  }

  public startTimer() {
    this.timer = setInterval(() => {
      this.updateProgressBar()
    }, 100)
  }

  private updateProgressBar() {
    if (this.barVal < 1) {
      if (!this.isLocationUnlock) {
        this.barVal += this.item.percentPerTick;
      } else {
        this.barVal += this.locBarPerc;
      }
    } else {
      //STOP Timer
      clearInterval(this.timer)
      this.barVal = 0;
      if (!this.isLocationUnlock) {
        if (this.generateRandomItemFromBase) {
          this.RandomElementNewItem();
        } else {
          this.SpecificElementNewItem(this.item);
        }
      } else {
        this.gds.DiscoverLocation(this.randomUnlockLocaiton);
        //Try and get a new location to discover!
        this.randomUnlockLocaiton = this.gds.FindRandomSubLocation(this.baseLocation)
      }
    }
  }
}
