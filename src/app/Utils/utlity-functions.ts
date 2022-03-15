import {IBaseItem} from "../models/items/baseItem.model";

export class UtilityFunctions {
  static CalcBarPercValues(item: IBaseItem): IBaseItem {
    item.percentPerTick = 100 / (item.loopTime / 100 ) / 100;
    item.barValue = 0;
    return item;
  }
}
