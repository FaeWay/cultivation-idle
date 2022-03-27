import {IBaseItem} from "../models/items/baseItem.model";
import {BodyTransformation} from "../models/progression/bodyTransformation";
import {IAdventureLocation} from "../models/locations/location.model";

export class UtilityFunctions {
  static CalcBarPercValues(item: IBaseItem | IAdventureLocation): IBaseItem | IAdventureLocation {
    item.percentPerTick = 100 / (item.actionTime / 100) / 100;
    item.barValue = 0;
    return item;
  }

  static GetBodyTransformationLevelExpRequirement(bdy: BodyTransformation, substage: number): number {
    let noZeroStage = 1;
    if (bdy.stage === 0) {
      return (bdy.stars + noZeroStage + bdy.gate) ^ 4 * substage ^ 2;
    }
    return (bdy.stars + bdy.stage + bdy.gate) ^ 4 * substage ^ 2;
  }
}
