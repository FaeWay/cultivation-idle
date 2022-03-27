import Decimal from 'break_eternity.js';
import {BodyTransformation} from "./progression/bodyTransformation";
import {CultivationRealms} from "./progression/cultivationRealms";
import {Skills} from "./progression/skills";

export class Player {
  name: string;
  age: number;
  //Spirit Training Exp
  qi: Decimal;
  //Body Training Exp
  exp: Decimal;
  bodyTransformation: BodyTransformation
  bodyTransformationSubStage: number
  spiritTransformations: CultivationRealms;
  spiritTransformationsSubStage: number;
  skillLevels: Map<Skills, Decimal>;


  constructor(name: string, age: number) {
    this.bodyTransformation = new BodyTransformation();
    this.bodyTransformationSubStage = 1;
    this.spiritTransformations = 0;
    this.spiritTransformationsSubStage = 1;
    this.age = age;
    this.name = name;
    this.qi = new Decimal(0);
    this.exp = new Decimal(0);
    this.skillLevels = new Map<Skills, Decimal>([
      [Skills.AnimalHusbandry, new Decimal(0)],
      [Skills.Discovery, new Decimal(0)],
      [Skills.Farming, new Decimal(0)],
      [Skills.Herbology, new Decimal(0)],
      [Skills.Smithing, new Decimal(0)],
    ])
  }


}
