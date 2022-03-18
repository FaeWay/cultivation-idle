import Decimal from 'break_eternity.js';
import {BodyTransformation} from "./progression/bodyTransformation";
import {CultivationRealms} from "./progression/cultivationRealms";

export class Player {
  name:string;
  age: number;
  qi: Decimal;
  bodyTransformation: BodyTransformation
  bodyTransformationSubStage:number
  spiritTransformations: CultivationRealms;
  spiritTransformationsSubStage:number;
}
