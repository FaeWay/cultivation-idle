import {IBaseItem} from "../../baseItem.model";
import {Element, ElementMaps} from "../../elements";
import Decimal from "break_eternity.js";
import {UtilityFunctions} from "../../../../Utils/utlity-functions";

export class WeakSpiritHerb implements IBaseItem {
  id: number;
  element: Element;
  displayName: string
  baseName: string
  qi: Decimal;
  baseResourceAmount: Decimal;
  lastTick: number;
  actionTime: number;
  percentPerTick: number;
  barValue: number;

  constructor(element: Element, qi?: Decimal) {
    this.element = element;
    this.baseName = "Weak Spirit Herb";
    this.RegenerateDisplayName();
    if (qi) {
      this.qi = qi;
    } else {
      qi = new Decimal();
    }
    this.element = element;
    this.RegenerateDisplayName();
    this.baseResourceAmount = new Decimal(1);
    this.actionTime = 2500;
    this.lastTick = 0;
    UtilityFunctions.CalcBarPercValues(this);
  }

  RegenerateDisplayName() {
    this.displayName = "Weak " + ElementMaps.display.get(this.element) + " Herb";
  }

}
