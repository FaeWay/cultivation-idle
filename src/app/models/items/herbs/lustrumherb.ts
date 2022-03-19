import {IBaseItem} from "../baseItem.model";
import {Element, ElementMaps} from "../elements";
import Decimal from "break_eternity.js";
import {UtilityFunctions} from "../../../Utils/utlity-functions";

export class LustrumHerb implements IBaseItem {
  id: number;
  element: Element;
  baseName: string
  displayName: string;
  qi: Decimal;
  baseResourceAmount: Decimal;
  lastTick: number;
  loopTime: number;
  percentPerTick: number;
  barValue: number;

  constructor(element: Element, qi?: Decimal) {
    this.element = element;
    this.baseName = "Lustrum Herb"
    this.RegenerateDisplayName();
    if (qi) {
      this.qi = qi;
    } else {
      qi = new Decimal();
    }
    this.baseResourceAmount = new Decimal(1);
    this.loopTime = 1000;
    this.lastTick = 0;
    UtilityFunctions.CalcBarPercValues(this);
  }

  RegenerateDisplayName() {
    this.displayName = ElementMaps.display.get(this.element) + "Lustrum Herb";
  }


}
