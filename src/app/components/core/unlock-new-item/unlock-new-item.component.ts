import {Component, Input, OnInit} from '@angular/core';
import {IBaseItem} from "../../../models/items/baseItem.model";
import {GamedataService} from "../../../services/gamedata.service";
import {IAdventureLocation} from "../../../models/locations/location.model";


@Component({
  selector: 'cvi-unlock-new-item',
  templateUrl: './unlock-new-item.component.html',
  styleUrls: ['./unlock-new-item.component.scss'],
})
export class UnlockNewItemComponent implements OnInit {

  @Input()
  item: IBaseItem;

  @Input()
  location: IAdventureLocation;

  @Input()
  GenerateRandomItemFromBase: boolean;

  @Input()
  actionName: string;


  private gds: GamedataService;

  constructor(private data: GamedataService) {
    this.gds = data;
  }

  ngOnInit() {
  }

  public ActivateNewItem() {
    if (this.GenerateRandomItemFromBase) {
      this.RandomElementNewItem();
    } else {
      this.SpecificElementNewItem(this.item);
    }
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
    return false;
  }


}
