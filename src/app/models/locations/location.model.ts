import {Element} from "../items/elements";
import {BodyTransformationStage} from "../progression/bodyTransformation";
import {CultivationRealms} from "../progression/cultivationRealms";
import {ISpecialFeature} from "../features/ISpecialFeature";

export interface IAdventureLocation {
  elementalPresence: Map<Element, number>; // Element Chance %
  name:string
  isTopLevelLocation: boolean;
  hasSubLocations: boolean;
  hasSpecialFeature:boolean;
  subLocations: Array<IAdventureLocation>;
  requiredBody: BodyTransformationStage;
  requiredSpirit: CultivationRealms;
  specialFeatures: Array<ISpecialFeature>;
}


export class LocationItemMaps {
  itemsInLocation: Map<string, string>;
}
