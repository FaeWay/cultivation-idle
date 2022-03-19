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
  location: IAdventureLocation;

  @Input()
  GenerateRandomItemFromBase: boolean;

  @Input()
  IsLocationUnlock: boolean;

  @Input()
  actionName: string;

  @Output()
  delayComplete: EventEmitter<boolean> = new EventEmitter<boolean>();


  private gds: GamedataService;
  private timer: any;
  public  barVal: number = 0;


  constructor(private data: GamedataService) {
    this.gds = data;
  }

  ngOnInit() {
  }


  public RandomElementNewItem() {
    this.gds.GenerateRandomElementFromLocationItem(this.location, this.item)
  }

  public SpecificElementNewItem(item: IBaseItem) {
    this.gds.UpSertResourceValue(item, item.baseResourceAmount);
  }

  public AllNeededFields() {
    if (this.item === undefined) {
      return true;
    }
    if (this.location === undefined) {
      return true;
    }
    if (this.IsLocationUnlock && this.GenerateRandomItemFromBase)
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
      this.barVal += this.item.percentPerTick;
    } else {
      //STOP Timer
      clearInterval(this.timer)
      this.barVal = 0;
      if (this.GenerateRandomItemFromBase) {
        this.RandomElementNewItem();
      } else {
        this.SpecificElementNewItem(this.item);
      }
    }
  }
}
