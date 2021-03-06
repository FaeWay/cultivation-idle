import {IAdventureLocation} from "../location.model";
import {Element} from '../../items/elements';
import {BodyTransformationStage} from "../../progression/bodyTransformation";
import {CultivationRealms} from "../../progression/cultivationRealms";
import {ISpecialFeature} from "../../features/ISpecialFeature";

export class BambooForest implements IAdventureLocation {
  name: string;
  elementalPresence: Map<Element, number>;
  isTopLevelLocation: boolean;
  requiredBody: BodyTransformationStage;
  requiredSpirit: CultivationRealms;
  hasSubLocations: boolean;
  hasSpecialFeature: boolean;
  specialFeatures: Array<ISpecialFeature>;
  subLocations: Array<IAdventureLocation>;
  unlockTime: number;

  constructor() {
    this.name = 'Bamboo Forest';
    this.elementalPresence = new Map<Element, number>();
    this.elementalPresence.set(Element.earth, 0.45)
    this.elementalPresence.set(Element.water, 0.45)
    this.elementalPresence.set(Element.metal, 0.10)
    // This is the 'BASE' Location
    this.isTopLevelLocation = true;
    // And it has places to go deeper on :)
    this.hasSubLocations = true;
    this.subLocations = new Array<IAdventureLocation>(); //TODO;
    // Basically nothing. Cheat, and use the Enum-value 0
    this.requiredBody = 0;
    this.requiredSpirit = 0;
    this.specialFeatures = new Array<ISpecialFeature>(); //None here at the base level.
    this.hasSpecialFeature = this.specialFeatures.length >= 1;
    this.unlockTime = 1;
  }
}

export class BambooForestFringe implements IAdventureLocation {
  name: string;
  elementalPresence: Map<Element, number>;
  hasSubLocations: boolean;
  isTopLevelLocation: boolean;
  requiredBody: BodyTransformationStage;
  requiredSpirit: CultivationRealms;
  subLocations: Array<IAdventureLocation>;
  hasSpecialFeature: boolean;
  specialFeatures: Array<ISpecialFeature>;
  unlockTime: number;

  constructor() {
    this.name = "Bamboo Forest Fringe";
    this.elementalPresence = new Map<Element, number>();
    this.elementalPresence.set(Element.earth, 0.75)
    this.elementalPresence.set(Element.water, 0.25)
    this.isTopLevelLocation = false;
    this.hasSubLocations = false;
    this.requiredBody = 0;
    this.requiredSpirit = 0;
    this.specialFeatures = new Array<ISpecialFeature>();
    this.hasSpecialFeature = this.specialFeatures.length >= 1;
    this.unlockTime = 25000;
  }
}

export class BambooForestGrove implements IAdventureLocation {
  name: string;
  elementalPresence: Map<Element, number>;
  hasSpecialFeature: boolean;
  hasSubLocations: boolean;
  isTopLevelLocation: boolean;
  requiredBody: BodyTransformationStage;
  requiredSpirit: CultivationRealms;
  specialFeatures: Array<ISpecialFeature>;
  subLocations: Array<IAdventureLocation>;
  unlockTime: number;

  constructor() {
    this.name = "Bamboo Forest Grove";
    this.elementalPresence = new Map<Element, number>();
    this.elementalPresence.set(Element.earth, 0.25)
    this.elementalPresence.set(Element.water, 0.50)
    this.elementalPresence.set(Element.fire, 0.25);
    this.isTopLevelLocation = false;
    this.hasSubLocations = false;
    this.requiredBody = 0;
    this.requiredSpirit = 0;
    this.specialFeatures = new Array<ISpecialFeature>();
    this.hasSpecialFeature = this.specialFeatures.length >= 1;
    this.unlockTime = 55000;
  }
}

export class BambooForestDepths implements IAdventureLocation {
  name: string;
  elementalPresence: Map<Element, number>;
  hasSpecialFeature: boolean;
  hasSubLocations: boolean;
  isTopLevelLocation: boolean;
  requiredBody: BodyTransformationStage;
  requiredSpirit: CultivationRealms;
  specialFeatures: Array<ISpecialFeature>;
  subLocations: Array<IAdventureLocation>;
  unlockTime: number;

  constructor() {
    this.name = "Bamboo Forest Depths";
    this.elementalPresence = new Map<Element, number>();
    this.elementalPresence.set(Element.earth, 0.80)
    this.elementalPresence.set(Element.fire, 0.2);
    this.isTopLevelLocation = false;
    this.hasSubLocations = false;
    this.requiredBody = 1;
    this.requiredSpirit = 1;
    this.specialFeatures = new Array<ISpecialFeature>();
    this.hasSpecialFeature = this.specialFeatures.length >= 1;
    this.unlockTime = 100000;
  }
}
