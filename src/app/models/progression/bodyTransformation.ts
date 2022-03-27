export enum BodyTransformationStage {
  strength,
  flesh,
  viscera,
  muscle,
  bone,
  pulse,
  marrow
}

export enum EightGates {
  healing,
  limit,
  wonder,
  pain,
  opening,
  view,
  life,
  death
}

export enum DaoPalaceStars {
  destruction,
  wolf,
  kismet,
  star,
  titan,
  song,
  virtue,
  channel,
  origin,
  understanding
}

export class BodyTransformation {
  stage: BodyTransformationStage;
  gate: EightGates
  stars: DaoPalaceStars

  constructor() {
    this.stage = 0;
    this.stars = 0;
    this.gate = 0;
  }

  /**
   *
   * Equations
   * Body-Tempering:
   *  BodyTransformation Stage
   *    y = s^4l^2 + previousStageExpReqs
   *    Where :
   *      y = exp total
   *      s = sub-level of staage
   *      l = current stage
   *
    */

}

