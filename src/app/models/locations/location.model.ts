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


export class LocationMaps {
  public static itemsInLocation: Map<string, string> = new Map<string, string>();
  ///Map of BaseLocation:Sub Location Strings
  public static subLocations: Map<string, Array<string>> = new Map<string,Array<string>>([
    [
      'Bamboo Forest', new Array<string>('Bamboo Forest Grove', 'Bamboo Forest Fringe', 'Bamboo Forest Depths')
    ]
  ])
}
