import {Component, Input, OnInit} from '@angular/core';
import Decimal from "break_eternity.js";
import {IBaseItem} from "../../../models/items/baseItem.model";
import {GamedataService} from "../../../services/gamedata.service";

@Component({
  selector: 'cvi-resource-consumer-action',
  templateUrl: './resource-consumer-action.component.html',
  styleUrls: ['./resource-consumer-action.component.scss'],
})
//TODO: Make this take a model of 'ItemCraftAction'
export class ResourceConsumerActionComponent implements OnInit {

  @Input()
  actionName: string;

  @Input()
  requiredItems: Map<IBaseItem, Decimal>;

  @Input()
  timeTaken: number

  @Input()
  outputItem: IBaseItem

  @Input()
  outputAmount: Decimal

  constructor(public gds: GamedataService) {
  }

  ngOnInit() {
  }

  public DetermineHighlightColor(item: IBaseItem, amount: Decimal): string {
    let isWarning = false;
    if (this.gds.GetResourceValue(item).isNan()) {
      isWarning = true;
    }
    if(!isWarning) {
      if (this.gds.GetResourceValue(item).cmp(amount) === -1) {
        isWarning = true;
      }
    }
    if(isWarning)
      return 'warning'

    return 'success'
  }

  public CanCraft(): boolean {
    let cc = true;
    for (let [key, val] of this.requiredItems) {
      cc = this.DetermineHighlightColor(key, val) !== 'warning';
      if (!cc)
        return cc;
    }
    return cc;
  }

  public FilterNaN(item: IBaseItem):string{
    let val = this.gds.GetResourceValue(item);
    if(val.isNan())
      return "0"
    else return val.valueOf()
  }
}
