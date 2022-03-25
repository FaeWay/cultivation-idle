import {IBaseItem} from "../../baseItem.model";
import {Element, ElementMaps} from "../../elements";
import Decimal from "break_eternity.js";
import {UtilityFunctions} from "../../../../Utils/utlity-functions";

export class HerbalPoultice implements  IBaseItem {
  barValue: number;
  baseName: string;
  baseResourceAmount: Decimal;
  displayName: string;
  element: Element;
  id: number;
  lastTick: number;
  loopTime: number;
  percentPerTick: number;
  qi: Decimal;


  constructor(element: Element, qi?: Decimal) {
    this.element = element;
    this.baseName = "Herbal Poultice";
    this.RegenerateDisplayName();
    if (qi) {
      this.qi = qi;
    } else {
      qi = new Decimal();
    }
    this.element = element;
    this.RegenerateDisplayName();
    this.baseResourceAmount = new Decimal(1);
    this.loopTime = 1000;
    this.lastTick = 0;
    UtilityFunctions.CalcBarPercValues(this);
  }

  RegenerateDisplayName() {
    this.displayName = ElementMaps.display.get(this.element) + " Element " + this.baseName;
  }


}
