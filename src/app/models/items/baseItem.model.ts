import {Element} from "./elements";
import Decimal from "break_eternity.js";

export interface IBaseItem {
  id: number;
  element: Element;
  qi: Decimal;
  baseName: string;
  displayName: string;
  lastTick: number;
  loopTime: number;
  baseResourceAmount: Decimal;
  percentPerTick: number;
  barValue: number;
  RegenerateDisplayName();
}
