import {IBaseItem} from "../baseItem.model";
import {Element, ElementMaps} from "../elements";
import Decimal from "break_eternity.js";

export class WeakSpiritHerb implements IBaseItem {
  element: Element;
  name: string
  qi: Decimal;
  baseResourceAmount: Decimal;
  lastTick: number;
  loopTime: number;
  percentPerTick: number;
  barValue: number;

  constructor(element:Element, qi?: Decimal) {
    this.element = element;
    this.name = "Weak " + ElementMaps.display.get(element) + " Herb";
    if(qi){
      this.qi = qi;
    } else {
      qi = new Decimal();
    }
    this.baseResourceAmount = new Decimal(1);
    this.loopTime = 1000;
    this.lastTick = 0;
  }

}
