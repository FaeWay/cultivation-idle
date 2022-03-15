import {Element} from "./elements";
import Decimal from "break_eternity.js";

export interface IBaseItem {
  element: Element;
  qi: Decimal;
  name: string;
  lastTick: number;
  loopTime: number;
  baseResourceAmount: Decimal;
  percentPerTick: number;
  barValue: number;
}
